import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, router, usePage } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export default function Category({ auth, categories }) {
    const [searchTerm, setSearchTerm] = useState('');
    const { flash } = usePage().props;
    const roleID = usePage().props.auth.user.role_id;
    const isAdmin = roleID === 1; // Only allow actions for users with roleID 1
    useEffect(() => {
        if (flash && flash.success) {
            Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: flash.success,
                confirmButtonText: 'OK',
            });
        }
    }, [flash]);

    const filteredCategories = categories.data.filter(category =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (categoryId) => {
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
                router.delete(route('products.category.destroy', categoryId), {
                    onSuccess: () => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Deleted!',
                            text: 'Category has been deleted.',
                            confirmButtonText: 'OK',
                        });
                    },
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
                        <h2 className="font-semibold text-xl text-gray-800 leading-tight">Categories</h2>
                        <Link
                            href={route('products.category.add')}
                            className="px-4 py-2 bg-[#7267ef] text-white rounded-lg hover:bg-[#6357df] focus:bg-[#6357df] transition-colors"
                        >
                            Add Category
                        </Link>
                    </div>
                )
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* Search Input */}
                            <div className="mb-6">
                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>

                            {/* Categories Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {filteredCategories.map((category) => (
                                            <tr key={category.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {category.name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-4">
                                                        {(auth.user.permissions.includes('PRODUCT_EDIT') || isAdmin) && (
                                                            <Link
                                                                href={route('products.category.edit', category.id)}
                                                                className="text-[#7267ef] hover:text-[#6357df]"
                                                            >
                                                                Edit
                                                            </Link>
                                                        )}

                                                        {(auth.user.permissions.includes('PRODUCT_DELETE') || isAdmin) && (
                                                            <button
                                                                onClick={() => handleDelete(category.id)}
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
                                {filteredCategories.length === 0 && (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500">No categories found</p>
                                    </div>
                                )}
                            </div>

                            {/* Pagination */}
                            {categories.links && (
                                <div className="mt-6">
                                    {/* Add pagination component here if needed */}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 