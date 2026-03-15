import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function Create(props) {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        product_code: '',
        category: '',
        stock_status: true,
        status: 'active',
        image: null,
        stock_count: '',
        hsncode: '',
        selling_price: '',
        cost_price: '',
        gst: ''
    });
    const submit = (e) => {
        e.preventDefault();

        post(route('products.store'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Product created successfully',
                    confirmButtonText: 'OK',
                });
            },
            forceFormData: true,
        });
    };
    const getProductCode = (word) => {
        // Remove vowels and keep only the first 3 consonants
        let abbreviation = word.toUpperCase().replace(/[AEIOU]/g, '').substring(0, 3);

        // Ensure it's exactly 3 characters (fallback if consonants are fewer)
        abbreviation = abbreviation.padEnd(3, word[0].toUpperCase());

        // Append a random 3-digit number
        //return abbreviation + '-' + Math.floor(100 + Math.random() * 900);
        setData('product_code', (abbreviation + '-' + Math.floor(100 + Math.random() * 900)));
    }
    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add Product</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            {/* New section to display product code */}
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold">Generated Product Code:</h3>
                                <p className="text-gray-700">{data.product_code}</p>
                            </div>
                            <form onSubmit={submit} className="space-y-8">
                                <section>
                                    <div className="grid grid-cols-2 gap-8 w-full">
                                        <div>
                                            <InputLabel htmlFor="category" value="Category" />
                                            <select
                                                id="category"
                                                name="category"
                                                value={data.category}
                                                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors h-12"
                                                onChange={(e) => {
                                                    setData('category', e.target.value);
                                                    getProductCode(e.target.options[e.target.selectedIndex].text);
                                                }}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {props.categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>
                                        <input type='hidden' name='product_code' className='product_code' id='product_code' value={data.product_code} />
                                        {/* Product Title */}
                                        <div>
                                            <InputLabel htmlFor="name" value="Product Title *" />
                                            <TextInput
                                                id="name"
                                                className="mt-1 block w-full h-12"
                                                value={data.title}
                                                onChange={(e) => setData('title', e.target.value)}
                                                required
                                                isFocused
                                                autoComplete="name"
                                            />
                                            <InputError className="mt-2" message={errors.title} />
                                        </div>
                                    </div>
                                </section>
                                {/* Additional Fields */}
                                <section>
                                    <div className="grid grid-cols-2 gap-8 w-full">
                                        <div>
                                            <InputLabel htmlFor="stock_count" value="Stock Count *" />
                                            <TextInput
                                                id="stock_count"
                                                className="mt-1 block w-full"
                                                value={data.stock_count}
                                                onChange={(e) => setData('stock_count', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.stock_count} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="hsncode" value="HSN Code *" />
                                            <TextInput
                                                id="hsncode"
                                                className="mt-1 block w-full"
                                                value={data.hsncode}
                                                onChange={(e) => setData('hsncode', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.hsncode} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="selling_price" value="Selling Price (INR) *" />
                                            <TextInput
                                                id="selling_price"
                                                className="mt-1 block w-full"
                                                value={data.selling_price}
                                                onChange={(e) => setData('selling_price', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.selling_price} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="cost_price" value="Cost Price (INR) *" />
                                            <TextInput
                                                id="cost_price"
                                                className="mt-1 block w-full"
                                                value={data.cost_price}
                                                onChange={(e) => setData('cost_price', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.cost_price} />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="gst" value="GST %" />
                                            <TextInput
                                                id="gst"
                                                className="mt-1 block w-full"
                                                value={data.gst}
                                                onChange={(e) => setData('gst', e.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.gst} />
                                        </div>
                                        {/* Stock Status Section */}
                                        <section className='max-w-xl'>
                                            <InputLabel value="Stock Status" />
                                            <div className="flex items-center mt-2">
                                                <label className="mr-4 flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="stock_status"
                                                        value="true"
                                                        checked={data.stock_status === true}
                                                        onChange={(e) => setData('stock_status', true)}
                                                        className="mr-2"
                                                    />
                                                    In Stock
                                                </label>
                                                <label className="flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="stock_status"
                                                        value="false"
                                                        checked={data.stock_status === false}
                                                        onChange={(e) => setData('stock_status', false)}
                                                        className="mr-2"
                                                    />
                                                    Out of Stock
                                                </label>
                                            </div>
                                            <InputError message={errors.stock_status} className="mt-2" />
                                        </section>
                                        <div>
                                            <InputLabel htmlFor="image" value="Upload Product Image" />
                                            <input
                                                type="file"
                                                id="image"
                                                className="mt-1 block w-full"
                                                onChange={(e) => setData('image', e.target.files[0])}
                                                accept="image/*"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Optional: Upload a product image
                                            </p>
                                            <InputError className="mt-2" message={errors.image} />
                                        </div>
                                    </div>
                                </section>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton
                                        className="px-6 py-3 bg-[#7267ef] hover:bg-[#6357df] focus:bg-[#6357df] active:bg-[#5e4edb]"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create Product'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 