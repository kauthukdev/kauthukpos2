import { useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

const Edit = (props) => {
    const { product, categories } = props;
    const [deleteImage, setDeleteImage] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        id: product.id,
        title: product.name,
        product_code: product.product_code,
        selling_price: product.price,
        cost_price: product.cost_price,
        stock_status: product.stock_status,
        image: null,
        category: product.category ? product.category.id : '',
        hsncode: product.hsncode,
        stock_count: product.stock_count,
        gst: product.gst,
        _delete_image: false
    });

    // Update the _delete_image value in the form data when deleteImage state changes
    useEffect(() => {
        setData('_delete_image', deleteImage);
    }, [deleteImage]);

    const submit = (e) => {
        e.preventDefault();

        // Create a new FormData object for the request
        const formData = new FormData();

        // Append all form fields with the correct names
        formData.append('_method', 'PUT'); // Laravel requires this for PUT requests
        formData.append('title', data.title);
        formData.append('product_code', data.product_code);
        formData.append('category', data.category);
        formData.append('selling_price', data.selling_price);
        formData.append('cost_price', data.cost_price);
        formData.append('stock_status', data.stock_status ? '1' : '0');
        formData.append('hsncode', data.hsncode);
        formData.append('gst', data.gst);
        formData.append('stock_count', data.stock_count);

        // Handle image deletion or update
        if (deleteImage) {
            // Explicitly set _delete_image to true as a string
            formData.append('_delete_image', '1');
            console.log('Deleting image:', deleteImage);
        } else if (data.image instanceof File) {
            // Make sure we're appending the actual File object
            // Create a new file with a unique name to avoid caching issues
            const uniqueFileName = `${Date.now()}_${data.image.name}`;
            const newFile = new File([data.image], uniqueFileName, { type: data.image.type });

            formData.append('image', newFile);
            console.log('Updating image with:', newFile);
            console.log('Image file type:', newFile.type);
            console.log('Image file size:', newFile.size);
            console.log('Image file name:', newFile.name);

            // Explicitly set _delete_image to false
            formData.append('_delete_image', '0');
        } else {
            // If neither deleting nor updating, explicitly set _delete_image to false
            formData.append('_delete_image', '0');
        }

        // Log the form data for debugging
        console.log('Form data entries:');
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        // Show the success popup first
        const showPopupAndRedirect = async () => {
            try {
                console.log('Submitting form with deleteImage state:', deleteImage);
                console.log('Form data _delete_image value:', formData.get('_delete_image'));

                // Check if the image file is properly included in the FormData
                if (formData.has('image')) {
                    const imageFile = formData.get('image');
                    console.log('Image file in FormData:', imageFile.name, imageFile.type, imageFile.size);
                }

                // Use a direct fetch approach for all submissions
                const response = await fetch(route('products.update', product.id), {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to update product');
                }

                // Show success popup
                await Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Product updated successfully',
                    confirmButtonText: 'OK',
                });

                // Redirect
                window.location.href = route('products.index');
            } catch (error) {
                // Show error popup
                console.error('Error during form submission:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: error.message || 'Failed to update product. Please check the form for errors.',
                    confirmButtonText: 'OK',
                });
            }
        };

        // Execute the async function
        showPopupAndRedirect();
    };

    return (
        <AuthenticatedLayout
            user={props.auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Product</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
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
                                                }}
                                                required
                                            >
                                                <option value="">Select a category</option>
                                                {categories.map((category) => (
                                                    <option key={category.id} value={category.id}>
                                                        {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.category} className="mt-2" />
                                        </div>
                                        <input type='hidden' name='product_code' className='product_code' id='product_code' value={data.product_code} />
                                        <div>
                                            <InputLabel htmlFor="title" value="Product Title *" />
                                            <TextInput
                                                id="title"
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
                                            {product.image && !deleteImage && (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm text-gray-600">Current Image:</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDeleteImage(true);
                                                                console.log('Delete image button clicked, setting deleteImage to true');
                                                            }}
                                                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                            Delete Image
                                                        </button>
                                                    </div>
                                                    <img
                                                        src={`/storage/${product.image}`}
                                                        alt={product.name}
                                                        className="w-40 h-40 object-cover border rounded-md"
                                                    />
                                                </div>
                                            )}
                                            {deleteImage && (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm text-red-600">Image will be deleted upon save</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                setDeleteImage(false);
                                                                console.log('Cancel delete button clicked, setting deleteImage to false');
                                                            }}
                                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                className="mt-1 block w-full"
                                                onChange={(e) => {
                                                    if (e.target.files && e.target.files[0]) {
                                                        const file = e.target.files[0];
                                                        console.log('File selected:', file);
                                                        console.log('File type:', file.type);
                                                        console.log('File size:', file.size);
                                                        console.log('File name:', file.name);

                                                        // Ensure it's a valid image file
                                                        if (file.type.startsWith('image/')) {
                                                            // Create a preview
                                                            const reader = new FileReader();
                                                            reader.onload = (event) => {
                                                                console.log('File loaded successfully');
                                                            };
                                                            reader.readAsDataURL(file);

                                                            setData('image', file);
                                                            setDeleteImage(false);
                                                        } else {
                                                            console.error('Invalid file type. Please select an image file.');
                                                            // Clear the file input
                                                            e.target.value = '';
                                                        }
                                                    }
                                                }}
                                                accept="image/*"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                {!deleteImage ? "Leave empty to keep the current image" : "Upload a new image or leave empty"}
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
                                        {processing ? 'Updating...' : 'Update Product'}
                                    </PrimaryButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
};

export default Edit; 