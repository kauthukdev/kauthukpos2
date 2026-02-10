import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Head, Link, useForm } from '@inertiajs/react';
import FullScreenLayout from '../../Layouts/FullScreenLayout';
import InputError from '../../Components/InputError';
import InputLabel from '../../Components/InputLabel';
import TextInput from '../../Components/TextInput';
import { format } from 'date-fns';
import axios from 'axios';

export default function Create({ auth, products }) {
    // New state for invoice configuration
    const [showConfigModal, setShowConfigModal] = useState(true);
    const [invoiceConfig, setInvoiceConfig] = useState({
        type: '', // 'B2B' or 'B2C'
        region: '', // 'Local' or 'Interstate'
    });
    const [invoicePrefix, setInvoicePrefix] = useState('');
    const [invoiceSerial, setInvoiceSerial] = useState('');

    const { data, setData, post, processing, errors, reset } = useForm({
        invoice_no: '',
        invoice_date: format(new Date(), 'yyyy-MM-dd'),
        buyer_name: '',
        buyer_address: '',
        buyer_gstin: '',
        delivery_note: '',
        mode_terms_of_payment: '',
        supplier_reference: '',
        other_reference: '',
        items: [
            {
                product_id: null,
                description: '',
                hsn: '',
                gst_percentage: 0,
                rate: 0,
                quantity: 1,
                discount_percentage: 0,
            },
        ],
    });

    const [totals, setTotals] = useState({
        subtotal: 0,
        totalTax: 0,
        cgst: 0,
        sgst: 0,
        grandTotal: 0,
    });


    // State for product search - now using arrays for each row
    const [searchTerms, setSearchTerms] = useState([]);
    const [filteredProductsArray, setFilteredProductsArray] = useState([]);
    const [showSuggestionsArray, setShowSuggestionsArray] = useState([]);
    const [activeIndexArray, setActiveIndexArray] = useState([]);
    const searchInputRefs = useRef([]);

    // Initialize row-specific states when items change
    useEffect(() => {
        // Ensure arrays have the same length as items
        if (data.items.length !== searchTerms.length) {
            setSearchTerms(Array(data.items.length).fill(''));
            setFilteredProductsArray(Array(data.items.length).fill([]));
            setShowSuggestionsArray(Array(data.items.length).fill(false));
            setActiveIndexArray(Array(data.items.length).fill(-1));
        }
    }, [data.items.length]);

    // Calculate totals whenever items change
    useEffect(() => {
        let subtotal = 0;
        let totalTax = 0;
        let cgst = 0;
        let sgst = 0;
        let grandTotal = 0;

        data.items.forEach(item => {
            const itemAmount = item.rate * item.quantity;
            const discountAmount = (itemAmount * item.discount_percentage) / 100;
            const afterDiscount = itemAmount - discountAmount;
            const gstAmount = (afterDiscount * item.gst_percentage) / 100;
            const itemCgst = gstAmount / 2;
            const itemSgst = gstAmount / 2;

            subtotal += afterDiscount;
            totalTax += gstAmount;
            cgst += itemCgst;
            sgst += itemSgst;
            grandTotal += (afterDiscount + gstAmount);
        });

        setTotals({
            subtotal: subtotal,
            totalTax: totalTax,
            cgst: cgst,
            sgst: sgst,
            grandTotal: grandTotal,
        });
    }, [data.items]);

    // Update invoice_no whenever prefix or serial changes
    useEffect(() => {
        if (invoicePrefix && invoiceSerial) {
            setData('invoice_no', `${invoicePrefix}${invoiceSerial}`);
        }
    }, [invoicePrefix, invoiceSerial]);

    // Financial Year Helper
    const getFinancialYear = (separator = '-') => {
        const today = new Date();
        const month = today.getMonth() + 1; // 1-12
        const year = today.getFullYear();

        let startYear, endYear;

        if (month >= 4) { // April onwards
            startYear = year;
            endYear = year + 1;
        } else { // Jan - March
            startYear = year - 1;
            endYear = year;
        }

        const shortStartYear = startYear.toString();
        const shortEndYear = endYear.toString().slice(-2);

        return `${shortStartYear}${separator}${shortEndYear}`;
    };

    // Generate prefix and fetch next number
    const generateInvoiceDetails = async (type, region) => {
        let prefix = '';
        let separator = '-'; // Default separator

        // Determine prefix format based on rules
        if (type === 'B2B' && region === 'Local') {
            // KAR-LB-2026-27/01 (separator for year is -, then slash)
            prefix = `KAR-LB-${getFinancialYear('-')}/`;
        } else if (type === 'B2B' && region === 'Interstate') {
            // KAR-IB-2026-27/1
            prefix = `KAR-IB-${getFinancialYear('-')}/`;
        } else if (type === 'B2C' && region === 'Local') {
            // KAR-LC-2026/27/1 (separator for year is /)
            prefix = `KAR-LC-${getFinancialYear('/')}/`;
        } else if (type === 'B2C' && region === 'Interstate') {
            // KAR-IC-2026/27/1
            prefix = `KAR-IC-${getFinancialYear('/')}/`;
        }

        setInvoicePrefix(prefix);

        try {
            const response = await axios.get(route('sales.next-number'), {
                params: { prefix }
            });
            const nextNum = response.data.next_number;

            // Format serial number (padding for B2B Local as per example)
            let formattedSerial = nextNum.toString();
            if (type === 'B2B' && region === 'Local' && nextNum < 10) {
                formattedSerial = `0${nextNum}`;
            }

            setInvoiceSerial(formattedSerial);
        } catch (error) {
            console.error('Error fetching next invoice number:', error);
            setInvoiceSerial('1'); // Fallback
        }
    };

    const handleConfigSelect = (key, value) => {
        const newConfig = { ...invoiceConfig, [key]: value };
        setInvoiceConfig(newConfig);

        // If both selected, close modal and generate invoice
        if (newConfig.type && (key === 'region' || newConfig.region)) {
            setShowConfigModal(false);
            generateInvoiceDetails(newConfig.type, key === 'region' ? value : newConfig.region);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('sales.store'));
    };

    // Filter products based on search term
    const filterProducts = (index, term) => {
        if (!term.trim()) {
            const newFilteredProducts = [...filteredProductsArray];
            newFilteredProducts[index] = [];
            setFilteredProductsArray(newFilteredProducts);
            return;
        }

        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );

        const newFilteredProducts = [...filteredProductsArray];
        newFilteredProducts[index] = filtered;
        setFilteredProductsArray(newFilteredProducts);

        const newShowSuggestions = [...showSuggestionsArray];
        newShowSuggestions[index] = true;
        setShowSuggestionsArray(newShowSuggestions);

        const newActiveIndex = [...activeIndexArray];
        newActiveIndex[index] = -1;
        setActiveIndexArray(newActiveIndex);
    };

    // Handle product selection from suggestions
    const handleProductSelect = (index, product) => {
        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            product_id: product.id,
            description: product.name,
            hsn: product.hsn || '',
            gst_percentage: product.gst || 0,
            rate: product.price || 0,
        };
        setData('items', updatedItems);

        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = '';
        setSearchTerms(newSearchTerms);

        const newShowSuggestions = [...showSuggestionsArray];
        newShowSuggestions[index] = false;
        setShowSuggestionsArray(newShowSuggestions);
    };

    // Handle custom product entry
    const handleCustomProduct = (index) => {
        const term = searchTerms[index];
        if (!term.trim()) return;

        const updatedItems = [...data.items];
        updatedItems[index] = {
            ...updatedItems[index],
            product_id: null,
            description: term,
        };
        setData('items', updatedItems);

        const newSearchTerms = [...searchTerms];
        newSearchTerms[index] = '';
        setSearchTerms(newSearchTerms);

        const newShowSuggestions = [...showSuggestionsArray];
        newShowSuggestions[index] = false;
        setShowSuggestionsArray(newShowSuggestions);
    };

    // Handle keyboard navigation in suggestions
    const handleKeyDown = (index, e) => {
        const filteredProducts = filteredProductsArray[index] || [];
        const activeIndex = activeIndexArray[index] || -1;

        // Down arrow
        if (e.keyCode === 40) {
            e.preventDefault();
            const newActiveIndex = [...activeIndexArray];
            newActiveIndex[index] = activeIndex < filteredProducts.length - 1 ? activeIndex + 1 : activeIndex;
            setActiveIndexArray(newActiveIndex);
        }
        // Up arrow
        else if (e.keyCode === 38) {
            e.preventDefault();
            const newActiveIndex = [...activeIndexArray];
            newActiveIndex[index] = activeIndex > 0 ? activeIndex - 1 : 0;
            setActiveIndexArray(newActiveIndex);
        }
        // Enter key
        else if (e.keyCode === 13 && activeIndex >= 0) {
            e.preventDefault();
            handleProductSelect(index, filteredProducts[activeIndex]);
        }
        // Enter key with no selection (custom product)
        else if (e.keyCode === 13 && activeIndex === -1 && searchTerms[index]?.trim()) {
            e.preventDefault();
            handleCustomProduct(index);
        }
        // Escape key
        else if (e.keyCode === 27) {
            const newShowSuggestions = [...showSuggestionsArray];
            newShowSuggestions[index] = false;
            setShowSuggestionsArray(newShowSuggestions);
        }
    };

    const handleItemChange = (index, field, value) => {
        const updatedItems = [...data.items];

        // Special handling for quantity field to ensure only natural numbers
        if (field === 'quantity') {
            // Convert to integer and ensure it's positive
            const intValue = parseInt(value, 10);
            // If it's a valid positive integer, use it, otherwise default to 1
            value = (!isNaN(intValue) && intValue > 0) ? intValue : 1;
        }

        updatedItems[index] = {
            ...updatedItems[index],
            [field]: value,
        };

        setData('items', updatedItems);
    };

    const addItem = () => {
        setData('items', [
            ...data.items,
            {
                product_id: null,
                description: '',
                hsn: '',
                gst_percentage: 0,
                rate: 0,
                quantity: 1,
                discount_percentage: 0,
            },
        ]);
    };

    const removeItem = (index) => {
        if (data.items.length > 1) {
            const updatedItems = [...data.items];
            updatedItems.splice(index, 1);
            setData('items', updatedItems);

            // Also update the search states
            const newSearchTerms = [...searchTerms];
            newSearchTerms.splice(index, 1);
            setSearchTerms(newSearchTerms);

            const newFilteredProducts = [...filteredProductsArray];
            newFilteredProducts.splice(index, 1);
            setFilteredProductsArray(newFilteredProducts);

            const newShowSuggestions = [...showSuggestionsArray];
            newShowSuggestions.splice(index, 1);
            setShowSuggestionsArray(newShowSuggestions);

            const newActiveIndex = [...activeIndexArray];
            newActiveIndex.splice(index, 1);
            setActiveIndexArray(newActiveIndex);
        } else {
            // If it's the last item, just clear the values instead of removing the row
            const updatedItems = [...data.items];
            updatedItems[index] = {
                product_id: null,
                description: '',
                hsn: '',
                gst_percentage: 0,
                rate: 0,
                quantity: 1,
                discount_percentage: 0,
            };
            setData('items', updatedItems);

            // Clear search term
            const newSearchTerms = [...searchTerms];
            newSearchTerms[index] = '';
            setSearchTerms(newSearchTerms);
        }
    };

    return (
        <FullScreenLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Create Sale</h2>}
        >
            <Head title="Create Sale" />

            {/* Configuration Modal */}
            {showConfigModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">
                                    Invoice Configuration
                                </h3>

                                {!invoiceConfig.type ? (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500">Please select the invoice type:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleConfigSelect('type', 'B2B')}
                                                className="w-full py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                B2B (Business to Business)
                                            </button>
                                            <button
                                                onClick={() => handleConfigSelect('type', 'B2C')}
                                                className="w-full py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                                            >
                                                B2C (Business to Consumer)
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-sm text-gray-500">
                                            Selected Type: <span className="font-bold">{invoiceConfig.type}</span>
                                            <button
                                                onClick={() => setInvoiceConfig({ ...invoiceConfig, type: '' })}
                                                className="ml-2 text-blue-600 hover:text-blue-800 text-xs underline"
                                            >
                                                Change
                                            </button>
                                        </p>
                                        <p className="text-sm text-gray-500">Please select the region:</p>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleConfigSelect('region', 'Local')}
                                                className="w-full py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                            >
                                                Local (Within State)
                                            </button>
                                            <button
                                                onClick={() => handleConfigSelect('region', 'Interstate')}
                                                className="w-full py-3 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
                                            >
                                                Interstate (Outside State)
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Print-specific styles */}
            <style>
                {`
                    @media print {
                        .no-print {
                            display: none !important;
                        }
                        input, textarea, select, button {
                            border: none !important;
                            background: transparent !important;
                            box-shadow: none !important;
                            -webkit-appearance: none !important;
                        }
                        .print-hide {
                            display: none !important;
                        }
                    }
                `}
            </style>

            <div className="py-6">
                <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={handleSubmit}>
                                {/* Header Section */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                    {/* Company Info */}
                                    <div className="border p-4 rounded-lg">
                                        <div className="flex items-center mb-4">
                                            <div className="w-20 h-20 mr-4">
                                                <img src="/images/logo.png" alt="Kauthuk Logo" className="w-full h-full object-contain" />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-bold">KAUTHUK</h2>
                                                <p className="text-sm">19/31601, Vymeethi, Thripunithura - 682301</p>
                                                <p className="text-sm">Phone: 8075727191, 9746290803</p>
                                                <p className="text-sm">E-Mail: sales@kauthuk.com</p>
                                                <p className="text-sm">GST:32AROPV6237K1Z4</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Empty Space */}
                                    <div></div>

                                    {/* Invoice Details */}
                                    <div className="border p-4 rounded-lg">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="invoice_no" value="Invoice No" />
                                                <div className="mt-1 flex rounded-md shadow-sm">
                                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                        {invoicePrefix || 'PREFIX-'}
                                                    </span>
                                                    <input
                                                        type="text"
                                                        id="invoice_no_serial"
                                                        className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                                        value={invoiceSerial}
                                                        onChange={(e) => setInvoiceSerial(e.target.value)}
                                                        placeholder="Serial No"
                                                        required
                                                    />
                                                </div>
                                                {/* Hidden input to ensure invoice_no is submitted */}
                                                <input type="hidden" name="invoice_no" value={data.invoice_no} />
                                                <InputError message={errors.invoice_no} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="invoice_date" value="Dated" />
                                                <TextInput
                                                    id="invoice_date"
                                                    type="date"
                                                    className="mt-1 block w-full"
                                                    value={data.invoice_date}
                                                    onChange={(e) => setData('invoice_date', e.target.value)}
                                                    required
                                                />
                                                <InputError message={errors.invoice_date} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="delivery_note" value="Delivery Note" />
                                                <TextInput
                                                    id="delivery_note"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.delivery_note}
                                                    onChange={(e) => setData('delivery_note', e.target.value)}
                                                />
                                                <InputError message={errors.delivery_note} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="mode_terms_of_payment" value="Mode/Terms of Payment" />
                                                <TextInput
                                                    id="mode_terms_of_payment"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.mode_terms_of_payment}
                                                    onChange={(e) => setData('mode_terms_of_payment', e.target.value)}
                                                />
                                                <InputError message={errors.mode_terms_of_payment} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="supplier_reference" value="Supplier Reference" />
                                                <TextInput
                                                    id="supplier_reference"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.supplier_reference}
                                                    onChange={(e) => setData('supplier_reference', e.target.value)}
                                                />
                                                <InputError message={errors.supplier_reference} className="mt-2" />
                                            </div>
                                            <div>
                                                <InputLabel htmlFor="other_reference" value="Other Reference" />
                                                <TextInput
                                                    id="other_reference"
                                                    type="text"
                                                    className="mt-1 block w-full"
                                                    value={data.other_reference}
                                                    onChange={(e) => setData('other_reference', e.target.value)}
                                                />
                                                <InputError message={errors.other_reference} className="mt-2" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Buyer Information */}
                                <div className="mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <InputLabel htmlFor="buyer_name" value="Buyer Name" />
                                            <TextInput
                                                id="buyer_name"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.buyer_name}
                                                onChange={(e) => setData('buyer_name', e.target.value)}
                                                required
                                            />
                                            <InputError message={errors.buyer_name} className="mt-2" />
                                        </div>
                                        <div>
                                            <InputLabel htmlFor="buyer_gstin" value="Buyer GSTIN" />
                                            <TextInput
                                                id="buyer_gstin"
                                                type="text"
                                                className="mt-1 block w-full"
                                                value={data.buyer_gstin}
                                                onChange={(e) => setData('buyer_gstin', e.target.value)}
                                            />
                                            <InputError message={errors.buyer_gstin} className="mt-2" />
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <InputLabel htmlFor="buyer_address" value="Buyer Address" />
                                        <textarea
                                            id="buyer_address"
                                            className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                            value={data.buyer_address}
                                            onChange={(e) => setData('buyer_address', e.target.value)}
                                            rows={3}
                                        />
                                        <InputError message={errors.buyer_address} className="mt-2" />
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mb-6">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border table-fixed">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                                    <th className="py-2 px-2 text-left w-12">SI</th>
                                                    <th className="py-2 px-2 text-left w-1/5">Description of Goods</th>
                                                    <th className="py-2 px-2 text-left w-24">HSN</th>
                                                    <th className="py-2 px-2 text-center w-20">GST %</th>
                                                    <th className="py-2 px-2 text-right w-28">Rate (INR)</th>
                                                    <th className="py-2 px-2 text-center w-24">Quantity</th>
                                                    <th className="py-2 px-2 text-center w-28">Discount (%)</th>
                                                    <th className="py-2 px-2 text-center w-24">CGST</th>
                                                    <th className="py-2 px-2 text-center w-24">SGST</th>
                                                    <th className="py-2 px-2 text-right w-32">Amount (INR)</th>
                                                    <th className="py-2 px-2 text-center w-16">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm">
                                                {data.items.map((item, index) => {
                                                    // Calculate item amount
                                                    const itemAmount = item.rate * item.quantity;
                                                    const discountAmount = (itemAmount * item.discount_percentage) / 100;
                                                    const afterDiscount = itemAmount - discountAmount;
                                                    const gstAmount = (afterDiscount * item.gst_percentage) / 100;
                                                    const itemCgst = gstAmount / 2;
                                                    const itemSgst = gstAmount / 2;
                                                    const totalAmount = afterDiscount + gstAmount;

                                                    return (
                                                        <tr key={index} className="border-b hover:bg-gray-50">
                                                            <td className="py-2 px-2 text-left">{index + 1}</td>
                                                            <td className="py-2 px-2 text-left">
                                                                <div className="relative">
                                                                    <TextInput
                                                                        ref={el => searchInputRefs.current[index] = el}
                                                                        type="text"
                                                                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                        placeholder="Search products..."
                                                                        value={item.description || searchTerms[index] || ''}
                                                                        onChange={(e) => {
                                                                            const value = e.target.value;

                                                                            // Update search term for this row
                                                                            const newSearchTerms = [...searchTerms];
                                                                            newSearchTerms[index] = value;
                                                                            setSearchTerms(newSearchTerms);

                                                                            filterProducts(index, value);

                                                                            // Clear existing product if user is typing
                                                                            if (item.product_id) {
                                                                                const updatedItems = [...data.items];
                                                                                updatedItems[index] = {
                                                                                    ...updatedItems[index],
                                                                                    product_id: null,
                                                                                    description: value,
                                                                                };
                                                                                setData('items', updatedItems);
                                                                            } else {
                                                                                handleItemChange(index, 'description', value);
                                                                            }
                                                                        }}
                                                                        onFocus={() => {
                                                                            if (searchTerms[index]) {
                                                                                const newShowSuggestions = [...showSuggestionsArray];
                                                                                newShowSuggestions[index] = true;
                                                                                setShowSuggestionsArray(newShowSuggestions);
                                                                            }
                                                                        }}
                                                                        onBlur={() => {
                                                                            // Delay hiding suggestions to allow clicking on them
                                                                            setTimeout(() => {
                                                                                const newShowSuggestions = [...showSuggestionsArray];
                                                                                newShowSuggestions[index] = false;
                                                                                setShowSuggestionsArray(newShowSuggestions);
                                                                            }, 200);
                                                                        }}
                                                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                                                    />


                                                                    {showSuggestionsArray[index] && filteredProductsArray[index]?.length > 0 && (() => {
                                                                        const ref = searchInputRefs.current[index];
                                                                        const rect = ref?.getBoundingClientRect?.();
                                                                        if (!rect) return null;
                                                                        return createPortal(
                                                                            <div
                                                                                className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl max-h-[500px] overflow-y-auto"
                                                                                style={{
                                                                                    top: `${rect.bottom}px`,
                                                                                    left: `${rect.left}px`,
                                                                                    width: `${rect.width}px`,
                                                                                    marginTop: '4px'
                                                                                }}
                                                                            >
                                                                                {filteredProductsArray[index].map((product, idx) => (
                                                                                    <div
                                                                                        key={product.id}
                                                                                        className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${activeIndexArray[index] === idx ? 'bg-gray-100' : ''}`}
                                                                                        onMouseDown={(e) => {
                                                                                            e.preventDefault();
                                                                                            handleProductSelect(index, product);
                                                                                        }}
                                                                                        onMouseEnter={() => {
                                                                                            const newActiveIndex = [...activeIndexArray];
                                                                                            newActiveIndex[index] = idx;
                                                                                            setActiveIndexArray(newActiveIndex);
                                                                                        }}
                                                                                    >
                                                                                        <div className="font-medium">{product.name}</div>
                                                                                        <div className="text-sm text-gray-500">
                                                                                            Price: ₹{product.price} | GST: {product.gst}%
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>,
                                                                            document.body
                                                                        );
                                                                    })()}

                                                                    {showSuggestionsArray[index] && searchTerms[index] && filteredProductsArray[index]?.length === 0 && (() => {
                                                                        const ref = searchInputRefs.current[index];
                                                                        const rect = ref?.getBoundingClientRect?.();
                                                                        if (!rect) return null;
                                                                        return createPortal(
                                                                            <div
                                                                                className="fixed z-[9999] bg-white border border-gray-300 rounded-md shadow-xl"
                                                                                style={{
                                                                                    top: `${rect.bottom}px`,
                                                                                    left: `${rect.left}px`,
                                                                                    width: `${rect.width}px`,
                                                                                    marginTop: '4px'
                                                                                }}
                                                                            >
                                                                                <div
                                                                                    className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                                                                                    onMouseDown={(e) => {
                                                                                        e.preventDefault();
                                                                                        handleCustomProduct(index);
                                                                                    }}
                                                                                >
                                                                                    Use "{searchTerms[index]}" as custom product
                                                                                </div>
                                                                            </div>,
                                                                            document.body
                                                                        );
                                                                    })()}
                                                                </div>
                                                            </td>
                                                            <td className="py-2 px-2 text-left">
                                                                <TextInput
                                                                    type="text"
                                                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                    value={item.hsn}
                                                                    onChange={(e) => handleItemChange(index, 'hsn', e.target.value)}
                                                                />
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                <TextInput
                                                                    type="number"
                                                                    className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                    value={item.gst_percentage}
                                                                    onChange={(e) => handleItemChange(index, 'gst_percentage', parseFloat(e.target.value) || 0)}
                                                                    min="0"
                                                                    step="0.01"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-2 text-right">
                                                                <TextInput
                                                                    type="number"
                                                                    className="w-full text-right rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                    value={item.rate}
                                                                    onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                                                                    min="0"
                                                                    step="0.01"
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                <TextInput
                                                                    type="number"
                                                                    className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                    value={item.quantity}
                                                                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                                                                    min="1"
                                                                    step="1"
                                                                    onKeyDown={(e) => {
                                                                        // Prevent decimal point
                                                                        if (e.key === '.') {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    required
                                                                />
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                <TextInput
                                                                    type="number"
                                                                    className="w-full text-center rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-sm py-1"
                                                                    value={item.discount_percentage}
                                                                    onChange={(e) => handleItemChange(index, 'discount_percentage', parseFloat(e.target.value) || 0)}
                                                                    min="0"
                                                                    max="100"
                                                                    step="0.01"
                                                                />
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                ₹{itemCgst.toFixed(2)}
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                ₹{itemSgst.toFixed(2)}
                                                            </td>
                                                            <td className="py-2 px-2 text-right">
                                                                ₹{totalAmount.toFixed(2)}
                                                            </td>
                                                            <td className="py-2 px-2 text-center">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(index)}
                                                                    className="text-red-600 hover:text-red-800 no-print"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                            <tfoot>
                                                <tr>
                                                    <td colSpan="11" className="py-2 px-2">
                                                        <button
                                                            type="button"
                                                            onClick={addItem}
                                                            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 no-print"
                                                        >
                                                            Add Item
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tfoot>
                                        </table>
                                    </div>
                                </div>

                                {/* Totals Section */}
                                <div className="mb-6">
                                    <div className="flex justify-end">
                                        <div className="w-full md:w-1/4">
                                            <div className="border p-4 rounded-lg">
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="font-medium">Taxable Value:</span>
                                                    <span>₹{totals.subtotal.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="font-medium">CGST:</span>
                                                    <span>₹{totals.cgst.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="font-medium">SGST:</span>
                                                    <span>₹{totals.sgst.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="font-medium">Total Tax:</span>
                                                    <span>₹{totals.totalTax.toFixed(2)}</span>
                                                </div>
                                                <div className="flex justify-between py-2 border-b">
                                                    <span className="font-medium">Round Off:</span>
                                                    <span>₹0.00</span>
                                                </div>
                                                <div className="flex justify-between py-2 font-bold">
                                                    <span>GRAND TOTAL:</span>
                                                    <span>₹{totals.grandTotal.toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Declaration */}
                                <div className="mb-6">
                                    <div className="border p-4 rounded-lg">
                                        <p className="text-center text-sm">
                                            We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                        </p>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-end mt-8 no-print">
                                    <Link
                                        href={route('sales.index')}
                                        className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 mr-2"
                                    >
                                        Cancel
                                    </Link>
                                    <button
                                        type="submit"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-lg font-medium"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Invoice'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </FullScreenLayout>
    );
} 