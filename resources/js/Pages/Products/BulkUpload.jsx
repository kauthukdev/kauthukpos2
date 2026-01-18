import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Link, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function BulkUpload({ auth, categories }) {
    const roleID = usePage().props.auth.user.role_id;
    const isAdmin = roleID === 1;
    const [uploading, setUploading] = useState(false);
    
    const { data, setData, post, processing, errors, reset } = useForm({
        file: null,
    });
    
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData('file', file);
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setUploading(true);
        
        post(route('products.process-bulk-upload'), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
        });
    };
    
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">Bulk Upload Products</h2>
                    <div className="flex space-x-4">
                        <Link
                            href={route('products.index')}
                            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:bg-gray-400 transition-colors"
                        >
                            Back to Products
                        </Link>
                        <a
                            href="/templates/product_import_template.xlsx"
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:bg-green-600 transition-colors"
                            download="product_import_template.xlsx"
                        >
                            Download Template
                        </a>
                    </div>
                </div>
            }
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <div className="mb-8 bg-blue-50 p-4 rounded-lg border border-blue-200">
                                <h3 className="text-lg font-semibold text-blue-800 mb-2">Bulk Upload Instructions</h3>
                                <ul className="list-disc pl-5 space-y-2 text-blue-800">
                                    <li>Download the template using the button in the header.</li>
                                    <li>Fill in the required fields: title, category, cost_price, selling_price.</li>
                                    <li>Category should be the category ID number.</li>
                                    <li>Product codes will be automatically generated based on the category name.</li>
                                    <li>Upload the completed file using the form below.</li>
                                </ul>
                                
                                <div className="mt-4">
                                    <h4 className="font-semibold text-blue-800 mb-2">Available Categories:</h4>
                                    <ul className="list-disc pl-5 mt-1 text-blue-800">
                                        {categories.map(category => (
                                            <li key={category.id}>ID: {category.id} - {category.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                            
                            <div className="mb-8 bg-green-50 p-4 rounded-lg border border-green-200">
                                <h3 className="text-lg font-semibold text-green-800 mb-2">About Product Code Generation</h3>
                                <p className="text-green-800 mb-2">
                                    Product codes are automatically generated using the following logic:
                                </p>
                                <ol className="list-decimal pl-5 space-y-2 text-green-800">
                                    <li>Take the category name and remove all vowels</li>
                                    <li>Keep the first 3 consonants (or pad with the first letter if fewer than 3 consonants)</li>
                                    <li>Append a random 3-digit number</li>
                                </ol>
                                <p className="text-green-800 mt-2">
                                    For example, if the category is "Electronics", the product code might be "LCT-123".
                                </p>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="file" className="block text-sm font-medium text-gray-700">
                                        Excel File
                                    </label>
                                    <div className="mt-1">
                                        <input
                                            id="file"
                                            name="file"
                                            type="file"
                                            accept=".xlsx,.xls,.csv"
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-[#7267ef] file:text-white
                                                hover:file:bg-[#6357df]"
                                            required
                                        />
                                    </div>
                                    {errors.file && (
                                        <p className="mt-2 text-sm text-red-600">{errors.file}</p>
                                    )}
                                </div>
                                
                                <div className="flex items-center justify-end">
                                    <button
                                        type="submit"
                                        disabled={processing || uploading || !data.file}
                                        className={`px-4 py-2 bg-[#7267ef] text-white rounded-lg hover:bg-[#6357df] focus:bg-[#6357df] transition-colors ${
                                            (processing || uploading || !data.file) ? 'opacity-50 cursor-not-allowed' : ''
                                        }`}
                                    >
                                        {uploading ? 'Uploading...' : 'Upload Products'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 