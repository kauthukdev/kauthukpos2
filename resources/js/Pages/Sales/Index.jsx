import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import Pagination from '../../Components/Pagination';
import { format } from 'date-fns';
import Swal from 'sweetalert2';

export default function Index({ auth, sales }) {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredSales = sales.data.filter(sale =>
        sale.invoice_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sale.buyer_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                router.delete(route('sales.destroy', id), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Sale has been deleted.',
                            confirmButtonText: 'OK',
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete sale.',
                            confirmButtonText: 'OK',
                        });
                    }
                });
            }
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Sales</h2>}
        >
            <Head title="Sales" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="flex justify-between items-center mb-6">
                                <h1 className="text-2xl font-semibold">Sales List</h1>
                                {(auth.user.permissions.includes('INVOICE_CREATE') || auth.user.assigned_roles.includes('Administrator')) && (
                                    <Link
                                        href={route('sales.create')}
                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        Add New Sale
                                    </Link>
                                )}
                            </div>

                            {/* Search Bar */}
                            <div className="mb-4">
                                <input
                                    type="text"
                                    placeholder="Search by invoice number or buyer name..."
                                    className="w-full px-4 py-2 border rounded-lg"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Sales Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full bg-white border">
                                    <thead>
                                        <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                                            <th className="py-3 px-6 text-left">Invoice No</th>
                                            <th className="py-3 px-6 text-left">Date</th>
                                            <th className="py-3 px-6 text-left">Buyer</th>
                                            <th className="py-3 px-6 text-right">Amount</th>
                                            <th className="py-3 px-6 text-center">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-gray-600 text-sm">
                                        {filteredSales.length > 0 ? (
                                            filteredSales.map((sale) => (
                                                <tr key={sale.id} className="border-b hover:bg-gray-50">
                                                    <td className="py-3 px-6 text-left whitespace-nowrap">
                                                        {sale.invoice_no}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {format(new Date(sale.invoice_date), 'dd/MM/yyyy')}
                                                    </td>
                                                    <td className="py-3 px-6 text-left">
                                                        {sale.buyer_name}
                                                    </td>
                                                    <td className="py-3 px-6 text-right">
                                                        ₹{parseFloat(sale.grand_total).toFixed(2)}
                                                    </td>
                                                    <td className="py-3 px-6 text-center">
                                                        <div className="flex item-center justify-center">
                                                            <Link
                                                                href={route('sales.show', sale.id)}
                                                                className="w-4 mr-2 transform hover:text-blue-500 hover:scale-110"
                                                                title="View"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                </svg>
                                                            </Link>

                                                            {(auth.user.permissions.includes('INVOICE_EDIT') || auth.user.assigned_roles.includes('Administrator')) && (
                                                                <Link
                                                                    href={route('sales.edit', sale.id)}
                                                                    className="w-4 mr-2 transform hover:text-yellow-500 hover:scale-110"
                                                                    title="Edit"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </Link>
                                                            )}

                                                            {(auth.user.permissions.includes('INVOICE_DELETE') || auth.user.assigned_roles.includes('Administrator')) && (
                                                                <button
                                                                    onClick={() => handleDelete(sale.id)}
                                                                    className="w-4 mr-2 transform hover:text-red-500 hover:scale-110"
                                                                    title="Delete"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="5" className="py-3 px-6 text-center">
                                                    No sales found
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            <div className="mt-4">
                                <Pagination links={sales.links} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 