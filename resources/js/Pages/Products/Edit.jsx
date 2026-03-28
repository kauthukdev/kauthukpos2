import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { toPublicPath } from '@/utils/assetPath';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

const moveItem = (items, fromIndex, toIndex) => {
    const nextItems = [...items];
    const [movedItem] = nextItems.splice(fromIndex, 1);
    nextItems.splice(toIndex, 0, movedItem);
    return nextItems;
};

const Edit = (props) => {
    const { product, categories } = props;
    const [deleteImage, setDeleteImage] = useState(false);
    const [galleryImages, setGalleryImages] = useState(product.gallery_images ?? []);
    const [deletedGalleryImageIds, setDeletedGalleryImageIds] = useState([]);
    const [data, setData] = useState({
        id: product.id,
        title: product.name,
        product_code: product.product_code,
        selling_price: product.price,
        cost_price: product.cost_price,
        stock_status: product.stock_status,
        image: null,
        additionalImages: [],
        category: product.category ? product.category.id : '',
        hsncode: product.hsncode,
        stock_count: product.stock_count,
        gst: product.gst,
    });
    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    const setField = (field, value) => {
        setData((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const removePendingImage = (indexToRemove) => {
        setData((current) => ({
            ...current,
            additionalImages: current.additionalImages.filter((_, index) => index !== indexToRemove),
        }));
    };

    const removeExistingGalleryImage = (imageId) => {
        setDeletedGalleryImageIds((current) => [...current, imageId]);
        setGalleryImages((current) => current.filter((image) => image.id !== imageId));
    };

    const moveGalleryImageUp = (index) => {
        if (index === 0) {
            return;
        }

        setGalleryImages((current) => moveItem(current, index, index - 1));
    };

    const moveGalleryImageDown = (index) => {
        if (index === galleryImages.length - 1) {
            return;
        }

        setGalleryImages((current) => moveItem(current, index, index + 1));
    };

    const submit = async (event) => {
        event.preventDefault();
        setProcessing(true);
        setErrors({});

        const formData = new FormData();
        formData.append('_method', 'PUT');
        formData.append('title', data.title);
        formData.append('product_code', data.product_code);
        formData.append('category', data.category);
        formData.append('selling_price', data.selling_price);
        formData.append('cost_price', data.cost_price);
        formData.append('stock_status', data.stock_status ? '1' : '0');
        formData.append('hsncode', data.hsncode);
        formData.append('gst', data.gst);
        formData.append('stock_count', data.stock_count);
        formData.append('_delete_image', deleteImage ? '1' : '0');
        formData.append('deleted_gallery_images', JSON.stringify(deletedGalleryImageIds));
        formData.append('gallery_order', JSON.stringify(galleryImages.map((image) => image.id)));

        if (data.image instanceof File) {
            formData.append('image', data.image);
        }

        data.additionalImages.forEach((file) => {
            formData.append('additional_images[]', file);
        });

        try {
            const response = await fetch(route('products.update', product.id), {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                    Accept: 'application/json',
                },
            });

            if (!response.ok) {
                const payload = await response.json();
                if (payload.errors) {
                    setErrors(payload.errors);
                }

                throw new Error(payload.message || 'Failed to update product');
            }

            await Swal.fire({
                icon: 'success',
                title: 'Success!',
                text: 'Product updated successfully',
                confirmButtonText: 'OK',
            });

            window.location.href = route('products.index');
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.message || 'Failed to update product. Please check the form for errors.',
                confirmButtonText: 'OK',
            });
        } finally {
            setProcessing(false);
        }
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
                                                onChange={(event) => setField('category', event.target.value)}
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
                                        <input type="hidden" name="product_code" value={data.product_code} />
                                        <div>
                                            <InputLabel htmlFor="title" value="Product Title *" />
                                            <TextInput
                                                id="title"
                                                className="mt-1 block w-full h-12"
                                                value={data.title}
                                                onChange={(event) => setField('title', event.target.value)}
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
                                                onChange={(event) => setField('stock_count', event.target.value)}
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
                                                onChange={(event) => setField('hsncode', event.target.value)}
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
                                                onChange={(event) => setField('selling_price', event.target.value)}
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
                                                onChange={(event) => setField('cost_price', event.target.value)}
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
                                                onChange={(event) => setField('gst', event.target.value)}
                                                required
                                            />
                                            <InputError className="mt-2" message={errors.gst} />
                                        </div>

                                        <section className="max-w-xl">
                                            <InputLabel value="Stock Status" />
                                            <div className="flex items-center mt-2">
                                                <label className="mr-4 flex items-center">
                                                    <input
                                                        type="radio"
                                                        name="stock_status"
                                                        value="true"
                                                        checked={data.stock_status === true}
                                                        onChange={() => setField('stock_status', true)}
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
                                                        onChange={() => setField('stock_status', false)}
                                                        className="mr-2"
                                                    />
                                                    Out of Stock
                                                </label>
                                            </div>
                                            <InputError message={errors.stock_status} className="mt-2" />
                                        </section>

                                        <div>
                                            <InputLabel htmlFor="image" value="Primary Product Image" />
                                            {product.image && !deleteImage ? (
                                                <div className="mb-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm text-gray-600">Current Primary Image:</p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteImage(true)}
                                                            className="text-red-500 hover:text-red-700 text-sm flex items-center"
                                                        >
                                                            Delete Image
                                                        </button>
                                                    </div>
                                                    <img
                                                        src={toPublicPath(`/storage/${product.image}`)}
                                                        alt={product.name}
                                                        className="w-40 h-40 object-cover border rounded-md"
                                                    />
                                                </div>
                                            ) : null}
                                            {deleteImage ? (
                                                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="text-sm text-red-600">
                                                            Primary image will be deleted upon save
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setDeleteImage(false)}
                                                            className="text-blue-500 hover:text-blue-700 text-sm"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : null}
                                            <input
                                                type="file"
                                                id="image"
                                                name="image"
                                                className="mt-1 block w-full"
                                                onChange={(event) => {
                                                    const file = event.target.files?.[0] ?? null;
                                                    setField('image', file);
                                                    if (file) {
                                                        setDeleteImage(false);
                                                    }
                                                }}
                                                accept="image/*"
                                            />
                                            <p className="text-xs text-gray-500 mt-1">
                                                Leave empty to keep the current primary image.
                                            </p>
                                            <InputError className="mt-2" message={errors.image} />
                                        </div>
                                    </div>
                                </section>

                                <section className="space-y-4">
                                    <div>
                                        <InputLabel value="Existing Gallery Images" />
                                        <p className="text-xs text-gray-500 mt-1">
                                            Reorder with the arrow buttons or delete individual gallery images.
                                        </p>
                                    </div>

                                    {galleryImages.length > 0 ? (
                                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                                            {galleryImages.map((galleryImage, index) => (
                                                <div key={galleryImage.id} className="rounded-lg border border-gray-200 p-4">
                                                    <img
                                                        src={toPublicPath(`/storage/${galleryImage.image_path}`)}
                                                        alt={`Gallery image ${index + 1}`}
                                                        className="h-40 w-full rounded-md object-cover"
                                                    />
                                                    <div className="mt-3 flex items-center justify-between gap-2">
                                                        <div className="flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => moveGalleryImageUp(index)}
                                                                disabled={index === 0}
                                                                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                                                            >
                                                                Up
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={() => moveGalleryImageDown(index)}
                                                                disabled={index === galleryImages.length - 1}
                                                                className="rounded border px-3 py-1 text-sm disabled:opacity-50"
                                                            >
                                                                Down
                                                            </button>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            onClick={() => removeExistingGalleryImage(galleryImage.id)}
                                                            className="text-sm text-red-600 hover:text-red-700"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="rounded-lg border border-dashed border-gray-300 px-4 py-6 text-sm text-gray-500">
                                            No additional gallery images yet.
                                        </div>
                                    )}
                                </section>

                                <section>
                                    <InputLabel htmlFor="additional_images" value="Add More Gallery Images" />
                                    <input
                                        type="file"
                                        id="additional_images"
                                        className="mt-1 block w-full"
                                        onChange={(event) =>
                                            setField('additionalImages', Array.from(event.target.files ?? []))
                                        }
                                        accept="image/*"
                                        multiple
                                    />
                                    <p className="text-xs text-gray-500 mt-1">
                                        New gallery images will be appended after the current ordered gallery.
                                    </p>
                                    <InputError className="mt-2" message={errors.additional_images} />
                                    <InputError className="mt-2" message={errors['additional_images.0']} />

                                    {data.additionalImages.length > 0 ? (
                                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                                            {data.additionalImages.map((file, index) => (
                                                <div
                                                    key={`${file.name}-${index}`}
                                                    className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-3"
                                                >
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-medium text-gray-900">{file.name}</p>
                                                        <p className="text-xs text-gray-500">
                                                            {(file.size / 1024).toFixed(0)} KB
                                                        </p>
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => removePendingImage(index)}
                                                        className="ml-3 text-sm text-red-600 hover:text-red-700"
                                                    >
                                                        Remove
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : null}
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
