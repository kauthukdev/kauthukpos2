import{r as p,j as e,H as m,L as h}from"./app-CABxPOhi.js";import{A as j}from"./AuthenticatedLayout-Cmp70j4O.js";import{f as l}from"./format-CBpsKyOP.js";import"./FlashMessage-BjrKAYaW.js";import"./transition-BD_bmrbL.js";import"./ApplicationLogo-BhUGilQf.js";function v({auth:c,sale:s}){var n,r;const[d,i]=p.useState(!1),a=s.is_interstate,x=()=>{i(!0),setTimeout(()=>{window.print(),setTimeout(()=>{i(!1)},500)},100)};return e.jsxs(j,{user:c.user,header:e.jsx("h2",{className:"font-semibold text-xl text-gray-800 leading-tight",children:"Sale Details"}),children:[e.jsx(m,{title:`${s.buyer_name}-${l(new Date(s.invoice_date),"dd-MM-yyyy")}`}),e.jsx("style",{children:`
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
                `}),e.jsx("div",{className:"py-12",children:e.jsx("div",{className:"max-w-7xl mx-auto sm:px-6 lg:px-8",children:e.jsx("div",{className:"bg-white overflow-hidden shadow-sm sm:rounded-lg",children:e.jsxs("div",{className:"p-6 text-gray-900",children:[e.jsxs("div",{className:"flex justify-between items-center mb-6 no-print",children:[e.jsxs("h1",{className:"text-2xl font-semibold",children:["Invoice #",s.invoice_no]}),e.jsxs("div",{className:"flex space-x-2",children:[e.jsxs("button",{onClick:x,className:"px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center",children:[e.jsx("svg",{xmlns:"http://www.w3.org/2000/svg",className:"h-5 w-5 mr-1",viewBox:"0 0 20 20",fill:"currentColor",children:e.jsx("path",{fillRule:"evenodd",d:"M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z",clipRule:"evenodd"})}),"Print Invoice (A5)"]}),e.jsx(h,{href:route("sales.index"),className:"px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700",children:"Back to Sales"})]})]}),e.jsxs("div",{className:`print-section ${d?"bg-white":""}`,children:[e.jsxs("div",{className:"flex items-center mb-3 border-b pb-2 header-section",children:[e.jsx("div",{className:"w-12 h-12 mr-2 logo-container",children:e.jsx("img",{src:"/images/logo.png",alt:"Kauthuk Logo",className:"w-full h-full object-contain"})}),e.jsxs("div",{className:"flex-1",children:[e.jsx("h2",{className:"text-base font-bold company-name",children:"KAUTHUK"}),e.jsx("p",{className:"text-xs",children:"19/31601, Vymeethi, Thripunithura - 682301"}),e.jsx("p",{className:"text-xs",children:"Ph: 8075727191, 9746290803 | sales@kauthuk.com"}),e.jsx("p",{className:"text-xs",children:"GST: 32AROPV6237K1Z4"})]}),e.jsxs("div",{className:"text-right",children:[e.jsx("h2",{className:"text-sm font-bold invoice-title",children:"TAX INVOICE"}),e.jsxs("p",{className:"text-xs",children:[e.jsx("span",{className:"font-medium",children:"No:"})," ",s.invoice_no]}),e.jsxs("p",{className:"text-xs",children:[e.jsx("span",{className:"font-medium",children:"Date:"})," ",l(new Date(s.invoice_date),"dd/MM/yyyy")]})]})]}),e.jsxs("div",{className:"grid grid-cols-2 gap-2 mb-2 details-grid",children:[e.jsxs("div",{className:"border p-2 rounded details-box",children:[e.jsx("h2",{className:"text-xs font-semibold mb-1",children:"Buyer Details"}),e.jsxs("div",{className:"text-xs space-y-0",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Name:"})," ",s.buyer_name]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Address:"})," ",s.buyer_address||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"GSTIN:"})," ",s.buyer_gstin||"N/A"]})]})]}),e.jsxs("div",{className:"border p-2 rounded details-box",children:[e.jsx("h2",{className:"text-xs font-semibold mb-1",children:"Invoice Details"}),e.jsxs("div",{className:"text-xs space-y-0",children:[e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Delivery:"})," ",s.delivery_note||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Payment:"})," ",s.mode_terms_of_payment||"N/A"]}),e.jsxs("p",{children:[e.jsx("span",{className:"font-medium",children:"Ref:"})," ",s.supplier_reference||"N/A"]})]})]})]}),e.jsx("div",{className:"mb-2 items-section",children:e.jsx("div",{className:"overflow-x-auto",children:e.jsxs("table",{className:"w-full bg-white border text-xs",children:[e.jsx("thead",{children:e.jsxs("tr",{className:"bg-gray-100 text-gray-700 text-xs",children:[e.jsx("th",{className:"py-1 px-1 text-left",children:"#"}),e.jsx("th",{className:"py-1 px-1 text-left",children:"Description"}),e.jsx("th",{className:"py-1 px-1 text-left",children:"HSN"}),e.jsx("th",{className:"py-1 px-1 text-center",children:"GST%"}),e.jsx("th",{className:"py-1 px-1 text-right",children:"Rate"}),e.jsx("th",{className:"py-1 px-1 text-center",children:"Qty"}),e.jsx("th",{className:"py-1 px-1 text-center",children:"Disc%"}),a?e.jsx("th",{className:"py-1 px-1 text-right",children:"IGST"}):e.jsxs(e.Fragment,{children:[e.jsx("th",{className:"py-1 px-1 text-right",children:"CGST"}),e.jsx("th",{className:"py-1 px-1 text-right",children:"SGST"})]}),e.jsx("th",{className:"py-1 px-1 text-right",children:"Amount"})]})}),e.jsx("tbody",{className:"text-gray-600 text-xs",children:(s.sale_items||s.saleItems)&&(((n=s.sale_items)==null?void 0:n.length)>0||((r=s.saleItems)==null?void 0:r.length)>0)?(s.sale_items||s.saleItems).map((t,o)=>e.jsxs("tr",{className:"border-b",children:[e.jsx("td",{className:"py-1 px-1 text-left",children:o+1}),e.jsx("td",{className:"py-1 px-1 text-left",children:t.description}),e.jsx("td",{className:"py-1 px-1 text-left",children:t.hsn||"-"}),e.jsxs("td",{className:"py-1 px-1 text-center",children:[t.gst_percentage,"%"]}),e.jsxs("td",{className:"py-1 px-1 text-right",children:["₹",parseFloat(t.rate).toFixed(2)]}),e.jsx("td",{className:"py-1 px-1 text-center",children:t.quantity}),e.jsxs("td",{className:"py-1 px-1 text-center",children:[t.discount_percentage,"%"]}),a?e.jsxs("td",{className:"py-1 px-1 text-right",children:["₹",parseFloat(t.igst).toFixed(2)]}):e.jsxs(e.Fragment,{children:[e.jsxs("td",{className:"py-1 px-1 text-right",children:["₹",parseFloat(t.cgst).toFixed(2)]}),e.jsxs("td",{className:"py-1 px-1 text-right",children:["₹",parseFloat(t.sgst).toFixed(2)]})]}),e.jsxs("td",{className:"py-1 px-1 text-right",children:["₹",parseFloat(t.amount).toFixed(2)]})]},t.id)):e.jsx("tr",{children:e.jsx("td",{colSpan:"10",className:"py-1 px-1 text-center",children:"No items found"})})})]})})}),e.jsx("div",{className:"border-t pt-2 totals-section",children:e.jsxs("div",{className:"flex justify-between",children:[e.jsx("div",{className:"w-1/2 pr-2",children:e.jsxs("div",{className:"text-xs italic",children:[e.jsx("span",{className:"font-medium",children:"Amount Chargeable (in words):"}),e.jsx("p",{children:s.amount_chargeable_in_words})]})}),e.jsxs("div",{className:"w-1/2 pl-2",children:[e.jsxs("div",{className:"flex justify-between py-0.5 text-xs border-b",children:[e.jsx("span",{className:"font-medium",children:"Taxable Value:"}),e.jsxs("span",{children:["₹",parseFloat(s.taxable_value).toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between py-0.5 text-xs border-b",children:[e.jsx("span",{className:"font-medium",children:"Total Tax:"}),e.jsxs("span",{children:["₹",parseFloat(s.total_tax).toFixed(2)]})]}),s.general_discount>0&&e.jsxs("div",{className:"flex justify-between py-0.5 text-xs border-b",children:[e.jsx("span",{className:"font-medium",children:"General Discount:"}),e.jsxs("span",{children:["₹",parseFloat(s.general_discount).toFixed(2)]})]}),e.jsxs("div",{className:"flex justify-between py-0.5 text-xs border-b",children:[e.jsx("span",{className:"font-medium",children:"Round Off:"}),e.jsx("span",{children:"₹0.00"})]}),e.jsxs("div",{className:"flex justify-between py-1 text-sm font-bold",children:[e.jsx("span",{children:"GRAND TOTAL:"}),e.jsxs("span",{children:["₹",parseFloat(s.grand_total).toFixed(2)]})]})]})]})}),e.jsx("div",{className:"mt-3 border-t pt-2 signature-section",children:e.jsxs("div",{className:"grid grid-cols-2 gap-2",children:[e.jsx("div",{children:e.jsx("p",{className:"text-xs",children:"We declare that this invoice shows the actual price of goods and all particulars are true and correct."})}),e.jsxs("div",{className:"text-right",children:[e.jsx("p",{className:"text-xs font-medium signature-space",children:"For KAUTHUK"}),e.jsx("p",{className:"text-xs font-medium",children:"Authorized Signatory"})]})]})})]})]})})})})]})}export{v as default};
