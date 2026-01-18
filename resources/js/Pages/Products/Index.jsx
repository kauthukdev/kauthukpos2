import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Index({ auth, products, filters }) {
    const roleID = usePage().props.auth.user.role_id;
    const isAdmin = roleID === 1; // Only allow actions for users with roleID 1
    const [searchTerm, setSearchTerm] = useState(filters.search || '');

    // Debug pagination data
    console.log('Pagination data:', {
        total: products.total,
        perPage: products.per_page,
        currentPage: products.current_page,
        lastPage: products.last_page,
        links: products.links
    });

    // Handle search with pagination
    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route('products.index'),
            { search: searchTerm },
            { preserveState: true }
        );
    };

    // Handle delete function
    const handleDelete = (productId) => {
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
                router.delete(route('products.destroy', productId), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Product has been deleted.',
                            confirmButtonText: 'OK',
                        });
                    },
                    onError: (errors) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Error!',
                            text: 'Failed to delete product.',
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
            header={
                (auth.user.permissions.includes('PRODUCT_CREATE') || isAdmin) && (
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Products</h2>
                        <div className="flex space-x-4">
                            <Link
                                href={route('products.bulk-upload')}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:bg-green-600 transition-colors"
                            >
                                Bulk Upload
                            </Link>
                            <Link
                                href={route('products.create')}
                                className="px-4 py-2 bg-[#7267ef] text-white rounded-lg hover:bg-[#6357df] focus:bg-[#6357df] transition-colors"
                            >
                                Add Product
                            </Link>
                        </div>
                    </div>
                )
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search Input */}
                            <form onSubmit={handleSearch} className="mb-6">
                                <div className="flex">
                                    <input
                                        type="text"
                                        placeholder="Search products..."
                                        className="w-full px-4 py-2 rounded-l-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-[#7267ef] text-white rounded-r-lg hover:bg-[#6357df] focus:bg-[#6357df] transition-colors"
                                    >
                                        Search
                                    </button>
                                </div>
                            </form>

                            {/* Products Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Image
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.data.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {product.category ? product.category.name : 'No Category'}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    {product.image && (
                                                        <img
                                                            src={`/storage/${product.image}`}
                                                            alt={product.title}
                                                            className="w-16 h-16 object-cover"
                                                        />
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        {(auth.user.permissions.includes('PRODUCT_EDIT') || isAdmin) && (
                                                            <Link
                                                                href={route('products.edit', product.id)}
                                                                className="text-[#7267ef] hover:text-[#6357df]"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}

                                                        {(auth.user.permissions.includes('PRODUCT_DELETE') || isAdmin) && (
                                                            <button
                                                                onClick={() => handleDelete(product.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                            >
                                                                Delete
                                                            </button>
                                                        )}

                                                        {(!auth.user.permissions.includes('PRODUCT_EDIT') && !auth.user.permissions.includes('PRODUCT_DELETE') && !isAdmin) && (
                                                            <span className="text-gray-500">Actions disabled</span>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>

                                {/* Empty State */}
                                {products.data.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">No products found</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {products.links && products.links.length > 0 && (
                                <div className="mt-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1 flex justify-between sm:hidden">
                                            {/* Mobile pagination */}
                                            {products.prev_page_url && (
                                                <Link
                                                    href={products.prev_page_url}
                                                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    Previous
                                                </Link>
                                            )}
                                            {products.next_page_url && (
                                                <Link
                                                    href={products.next_page_url}
                                                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                                    preserveScroll
                                                    preserveState
                                                >
                                                    Next
                                                </Link>
                                            )}
                                        </div>
                                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                            <div>
                                                <p className="text-sm text-gray-700">
                                                    Showing <span className="font-medium">{products.from}</span> to{' '}
                                                    <span className="font-medium">{products.to}</span> of{' '}
                                                    <span className="font-medium">{products.total}</span> results
                                                </p>
                                            </div>
                                            <div>
                                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                                    {/* First Page Link */}
                                                    {products.current_page > 1 && (
                                                        <Link
                                                            href={products.first_page_url}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            preserveScroll
                                                            preserveState
                                                        >
                                                            <span className="sr-only">First</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M15.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 010 1.414zm-6 0a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 1.414L5.414 10l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}

                                                    {/* Previous Page Link */}
                                                    {products.prev_page_url && (
                                                        <Link
                                                            href={products.prev_page_url}
                                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            preserveScroll
                                                            preserveState
                                                        >
                                                            <span className="sr-only">Previous</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}

                                                    {/* Page Links */}
                                                    {products.links.map((link, i) => {
                                                        // Skip first and last links (prev/next) as we handle them separately
                                                        if (i === 0 || i === products.links.length - 1) {
                                                            return null;
                                                        }

                                                        return link.url ? (
                                                            <Link
                                                                key={i}
                                                                href={link.url}
                                                                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${link.active
                                                                    ? 'z-10 bg-[#7267ef] border-[#7267ef] text-white'
                                                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                                                    }`}
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                                preserveScroll
                                                                preserveState
                                                            />
                                                        ) : (
                                                            <span
                                                                key={i}
                                                                className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                                            />
                                                        );
                                                    })}

                                                    {/* Next Page Link */}
                                                    {products.next_page_url && (
                                                        <Link
                                                            href={products.next_page_url}
                                                            className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            preserveScroll
                                                            preserveState
                                                        >
                                                            <span className="sr-only">Next</span>
                                                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}

                                                    {/* Last Page Link */}
                                                    {products.current_page < products.last_page && (
                                                        <Link
                                                            href={products.last_page_url}
                                                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                                            preserveScroll
                                                            preserveState
                                                        >
                                                            <span className="sr-only">Last</span>
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L8.586 10 4.293 14.293a1 1 0 000 1.414zm6 0a1 1 0 001.414 0l5-5a1 1 0 000-1.414l-5-5a1 1 0 00-1.414 1.414L15.586 10l-4.293 4.293a1 1 0 000 1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </Link>
                                                    )}
                                                </nav>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 