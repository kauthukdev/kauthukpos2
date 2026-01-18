import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '../../Layouts/AuthenticatedLayout';
import { format } from 'date-fns';
import { useState } from 'react';

export default function Show({ auth, sale }) {
    const [isPrinting, setIsPrinting] = useState(false);
    
    const handlePrint = () => {
        setIsPrinting(true);
        setTimeout(() => {
            window.print();
            setTimeout(() => {
                setIsPrinting(false);
            }, 500);
        }, 100);
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sale Details</h2>}
        >
            <Head title="Sale Details" />
            
            {/* Print-specific styles */}
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .print-section, .print-section * {
                            visibility: visible;
                        }
                        .print-section {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 20px;
                        }
                        .no-print {
                            display: none !important;
                        }
                        .page-break {
                            page-break-after: always;
                        }
                        table {
                            width: 100%;
                            border-collapse: collapse;
                        }
                        th, td {
                            border: 1px solid #ddd;
                            padding: 8px;
                        }
                    }
                `}
            </style>

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6 no-print">
                                <h1 className="text-2xl font-semibold">Invoice #{sale.invoice_no}</h1>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handlePrint}
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" />
                                        </svg>
                                        Print Invoice
                                    </button>
                                    <Link
                                        href={route('sales.index')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        Back to Sales
                                    </Link>
                                </div>
                            </div>

                            {/* Print Section */}
                            <div className={`print-section ${isPrinting ? 'bg-white' : ''}`}>
                                {/* Header with Company Info */}
                                <div className="flex items-center mb-6 border-b pb-4">
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
                                    <div className="ml-auto text-right">
                                        <h2 className="text-xl font-bold">TAX INVOICE</h2>
                                        <p className="text-sm"><span className="font-medium">Invoice No:</span> {sale.invoice_no}</p>
                                        <p className="text-sm"><span className="font-medium">Date:</span> {format(new Date(sale.invoice_date), 'dd/MM/yyyy')}</p>
                                    </div>
                                </div>

                                {/* Invoice Details and Buyer Info */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                    <div className="border p-4 rounded-lg">
                                        <h2 className="text-lg font-semibold mb-2">Invoice Details</h2>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 font-medium">Delivery Note:</td>
                                                    <td className="py-1">{sale.delivery_note || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 font-medium">Mode/Terms of Payment:</td>
                                                    <td className="py-1">{sale.mode_terms_of_payment || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 font-medium">Supplier Reference:</td>
                                                    <td className="py-1">{sale.supplier_reference || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 font-medium">Other Reference:</td>
                                                    <td className="py-1">{sale.other_reference || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="border p-4 rounded-lg">
                                        <h2 className="text-lg font-semibold mb-2">Buyer Details</h2>
                                        <table className="w-full text-sm">
                                            <tbody>
                                                <tr>
                                                    <td className="py-1 font-medium">Name:</td>
                                                    <td className="py-1">{sale.buyer_name}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 font-medium">Address:</td>
                                                    <td className="py-1">{sale.buyer_address || 'N/A'}</td>
                                                </tr>
                                                <tr>
                                                    <td className="py-1 font-medium">GSTIN:</td>
                                                    <td className="py-1">{sale.buyer_gstin || 'N/A'}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Items Table */}
                                <div className="mb-6">
                                    <h2 className="text-lg font-semibold mb-2">Items</h2>
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full bg-white border">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-4 text-left">SI</th>
                                                    <th className="py-3 px-4 text-left">Description</th>
                                                    <th className="py-3 px-4 text-left">HSN</th>
                                                    <th className="py-3 px-4 text-center">GST %</th>
                                                    <th className="py-3 px-4 text-right">Rate (INR)</th>
                                                    <th className="py-3 px-4 text-center">Quantity</th>
                                                    <th className="py-3 px-4 text-center">Discount (%)</th>
                                                    <th className="py-3 px-4 text-right">CGST (INR)</th>
                                                    <th className="py-3 px-4 text-right">SGST (INR)</th>
                                                    <th className="py-3 px-4 text-right">Amount (INR)</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm">
                                                {(sale.sale_items || sale.saleItems) && (sale.sale_items?.length > 0 || sale.saleItems?.length > 0) ? (
                                                    (sale.sale_items || sale.saleItems).map((item, index) => (
                                                        <tr key={item.id} className="border-b hover:bg-gray-50">
                                                            <td className="py-3 px-4 text-left">{index + 1}</td>
                                                            <td className="py-3 px-4 text-left">{item.description}</td>
                                                            <td className="py-3 px-4 text-left">{item.hsn || 'N/A'}</td>
                                                            <td className="py-3 px-4 text-center">{item.gst_percentage}%</td>
                                                            <td className="py-3 px-4 text-right">₹{parseFloat(item.rate).toFixed(2)}</td>
                                                            <td className="py-3 px-4 text-center">{item.quantity}</td>
                                                            <td className="py-3 px-4 text-center">{item.discount_percentage}%</td>
                                                            <td className="py-3 px-4 text-right">₹{parseFloat(item.cgst).toFixed(2)}</td>
                                                            <td className="py-3 px-4 text-right">₹{parseFloat(item.sgst).toFixed(2)}</td>
                                                            <td className="py-3 px-4 text-right">₹{parseFloat(item.amount).toFixed(2)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="py-3 px-4 text-center">No items found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Totals Section */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-end">
                                        <div className="w-full md:w-1/3">
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Taxable Value:</span>
                                                <span>₹{parseFloat(sale.taxable_value).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Total Tax:</span>
                                                <span>₹{parseFloat(sale.total_tax).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-2 border-b">
                                                <span className="font-medium">Round Off:</span>
                                                <span>₹0.00</span>
                                            </div>
                                            <div className="flex justify-between py-2 font-bold">
                                                <span>GRAND TOTAL:</span>
                                                <span>₹{parseFloat(sale.grand_total).toFixed(2)}</span>
                                            </div>
                                            <div className="mt-2 text-sm italic">
                                                <span className="font-medium">Amount Chargeable (in words):</span>
                                                <p>{sale.amount_chargeable_in_words}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Declaration and Signature */}
                                <div className="mt-8 border-t pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <p className="text-sm">
                                                We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium mb-10">For KAUTHUK</p>
                                            <p className="font-medium">Authorized Signatory</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 