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
            <Head title={`${sale.buyer_name}-${format(new Date(sale.invoice_date), 'dd-MM-yyyy')}`} />

            {/* Print-specific styles for A5 size (half of A4) */}
            <style>
                {`
                    @media print {
                        @page {
                            size: A5 portrait;
                            margin: 5mm;
                        }
                        body * {
                            visibility: hidden;
                        }
                        body {
                            font-size: 9px !important;
                        }
                        .print-section, .print-section * {
                            visibility: visible;
                        }
                        .print-section {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            padding: 3mm;
                            font-size: 9px !important;
                        }
                        .print-section h2 {
                            font-size: 11px !important;
                            margin-bottom: 2px !important;
                        }
                        .print-section .company-name {
                            font-size: 14px !important;
                        }
                        .print-section .invoice-title {
                            font-size: 12px !important;
                        }
                        .print-section p, .print-section span, .print-section td {
                            font-size: 8px !important;
                            line-height: 1.2 !important;
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
                            border: 1px solid #ccc;
                            padding: 2px 3px !important;
                            font-size: 7px !important;
                        }
                        th {
                            font-size: 7px !important;
                            padding: 3px !important;
                            background-color: #f0f0f0 !important;
                        }
                        .print-section .header-section {
                            padding-bottom: 3px !important;
                            margin-bottom: 3px !important;
                        }
                        .print-section .logo-container {
                            width: 35px !important;
                            height: 35px !important;
                        }
                        .print-section .details-grid {
                            gap: 3px !important;
                            margin-bottom: 3px !important;
                        }
                        .print-section .details-box {
                            padding: 3px !important;
                        }
                        .print-section .items-section {
                            margin-bottom: 3px !important;
                        }
                        .print-section .totals-section {
                            padding-top: 3px !important;
                        }
                        .print-section .signature-section {
                            margin-top: 5px !important;
                            padding-top: 3px !important;
                        }
                        .print-section .signature-space {
                            margin-bottom: 15px !important;
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
                                        Print Invoice (A5)
                                    </button>
                                    <Link
                                        href={route('sales.index')}
                                        className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                                    >
                                        Back to Sales
                                    </Link>
                                </div>
                            </div>

                            {/* Print Section - Compact A5 Layout */}
                            <div className={`print-section ${isPrinting ? 'bg-white' : ''}`}>
                                {/* Header with Company Info - Compact */}
                                <div className="flex items-center mb-3 border-b pb-2 header-section">
                                    <div className="w-12 h-12 mr-2 logo-container">
                                        <img src="/images/logo.png" alt="Kauthuk Logo" className="w-full h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-base font-bold company-name">KAUTHUK</h2>
                                        <p className="text-xs">19/31601, Vymeethi, Thripunithura - 682301</p>
                                        <p className="text-xs">Ph: 8075727191, 9746290803 | sales@kauthuk.com</p>
                                        <p className="text-xs">GST: 32AROPV6237K1Z4</p>
                                    </div>
                                    <div className="text-right">
                                        <h2 className="text-sm font-bold invoice-title">TAX INVOICE</h2>
                                        <p className="text-xs"><span className="font-medium">No:</span> {sale.invoice_no}</p>
                                        <p className="text-xs"><span className="font-medium">Date:</span> {format(new Date(sale.invoice_date), 'dd/MM/yyyy')}</p>
                                    </div>
                                </div>

                                {/* Invoice Details and Buyer Info - Compact Side by Side */}
                                <div className="grid grid-cols-2 gap-2 mb-2 details-grid">
                                    <div className="border p-2 rounded details-box">
                                        <h2 className="text-xs font-semibold mb-1">Buyer Details</h2>
                                        <div className="text-xs space-y-0">
                                            <p><span className="font-medium">Name:</span> {sale.buyer_name}</p>
                                            <p><span className="font-medium">Address:</span> {sale.buyer_address || 'N/A'}</p>
                                            <p><span className="font-medium">GSTIN:</span> {sale.buyer_gstin || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="border p-2 rounded details-box">
                                        <h2 className="text-xs font-semibold mb-1">Invoice Details</h2>
                                        <div className="text-xs space-y-0">
                                            <p><span className="font-medium">Delivery:</span> {sale.delivery_note || 'N/A'}</p>
                                            <p><span className="font-medium">Payment:</span> {sale.mode_terms_of_payment || 'N/A'}</p>
                                            <p><span className="font-medium">Ref:</span> {sale.supplier_reference || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Items Table - Compact */}
                                <div className="mb-2 items-section">
                                    <div className="overflow-x-auto">
                                        <table className="w-full bg-white border text-xs">
                                            <thead>
                                                <tr className="bg-gray-100 text-gray-700 text-xs">
                                                    <th className="py-1 px-1 text-left">#</th>
                                                    <th className="py-1 px-1 text-left">Description</th>
                                                    <th className="py-1 px-1 text-left">HSN</th>
                                                    <th className="py-1 px-1 text-center">GST%</th>
                                                    <th className="py-1 px-1 text-right">Rate</th>
                                                    <th className="py-1 px-1 text-center">Qty</th>
                                                    <th className="py-1 px-1 text-center">Disc%</th>
                                                    <th className="py-1 px-1 text-right">CGST</th>
                                                    <th className="py-1 px-1 text-right">SGST</th>
                                                    <th className="py-1 px-1 text-right">Amount</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-xs">
                                                {(sale.sale_items || sale.saleItems) && (sale.sale_items?.length > 0 || sale.saleItems?.length > 0) ? (
                                                    (sale.sale_items || sale.saleItems).map((item, index) => (
                                                        <tr key={item.id} className="border-b">
                                                            <td className="py-1 px-1 text-left">{index + 1}</td>
                                                            <td className="py-1 px-1 text-left">{item.description}</td>
                                                            <td className="py-1 px-1 text-left">{item.hsn || '-'}</td>
                                                            <td className="py-1 px-1 text-center">{item.gst_percentage}%</td>
                                                            <td className="py-1 px-1 text-right">₹{parseFloat(item.rate).toFixed(2)}</td>
                                                            <td className="py-1 px-1 text-center">{item.quantity}</td>
                                                            <td className="py-1 px-1 text-center">{item.discount_percentage}%</td>
                                                            <td className="py-1 px-1 text-right">₹{parseFloat(item.cgst).toFixed(2)}</td>
                                                            <td className="py-1 px-1 text-right">₹{parseFloat(item.sgst).toFixed(2)}</td>
                                                            <td className="py-1 px-1 text-right">₹{parseFloat(item.amount).toFixed(2)}</td>
                                                        </tr>
                                                    ))
                                                ) : (
                                                    <tr>
                                                        <td colSpan="10" className="py-1 px-1 text-center">No items found</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                {/* Totals Section - Compact */}
                                <div className="border-t pt-2 totals-section">
                                    <div className="flex justify-between">
                                        <div className="w-1/2 pr-2">
                                            <div className="text-xs italic">
                                                <span className="font-medium">Amount Chargeable (in words):</span>
                                                <p>{sale.amount_chargeable_in_words}</p>
                                            </div>
                                        </div>
                                        <div className="w-1/2 pl-2">
                                            <div className="flex justify-between py-0.5 text-xs border-b">
                                                <span className="font-medium">Taxable Value:</span>
                                                <span>₹{parseFloat(sale.taxable_value).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-0.5 text-xs border-b">
                                                <span className="font-medium">Total Tax:</span>
                                                <span>₹{parseFloat(sale.total_tax).toFixed(2)}</span>
                                            </div>
                                            <div className="flex justify-between py-0.5 text-xs border-b">
                                                <span className="font-medium">Round Off:</span>
                                                <span>₹0.00</span>
                                            </div>
                                            <div className="flex justify-between py-1 text-sm font-bold">
                                                <span>GRAND TOTAL:</span>
                                                <span>₹{parseFloat(sale.grand_total).toFixed(2)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Declaration and Signature - Compact */}
                                <div className="mt-3 border-t pt-2 signature-section">
                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <p className="text-xs">
                                                We declare that this invoice shows the actual price of goods and all particulars are true and correct.
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-medium signature-space">For KAUTHUK</p>
                                            <p className="text-xs font-medium">Authorized Signatory</p>
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