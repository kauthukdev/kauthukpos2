import { useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

const Edit = ({ auth, category }) => {
    const { data, setData, post, processing, errors } = useForm({
        name: category.name,
        icon: null,
        _method: 'put',
    });
    const [iconPreview, setIconPreview] = useState(category.icon_url);

    useEffect(() => {
        if (!(data.icon instanceof File)) {
            setIconPreview(category.icon_url ?? null);
            return undefined;
        }

        const previewUrl = URL.createObjectURL(data.icon);
        setIconPreview(previewUrl);

        return () => {
            URL.revokeObjectURL(previewUrl);
        };
    }, [category.icon_url, data.icon]);

    const submit = (e) => {
        e.preventDefault();
        post(route('products.category.update', category.id), {
            forceFormData: true,
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Category updated successfully',
                    confirmButtonText: 'OK',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Edit Category</h2>}
        >
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <form onSubmit={submit} className="space-y-8">
                                <div className="grid grid-cols-1 gap-8">
                                    {/* Name */}
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="name" value="Name" className="text-gray-700 text-sm font-bold mb-2" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors"
                                            onChange={(e) => setData('name', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    <div className="col-span-1">
                                        <InputLabel htmlFor="icon" value="Category Icon" className="text-gray-700 text-sm font-bold mb-2" />
                                        <input
                                            id="icon"
                                            name="icon"
                                            type="file"
                                            accept=".jpg,.jpeg,.png,.webp,.svg"
                                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-[#7267ef] file:px-4 file:py-2 file:text-white"
                                            onChange={(e) => setData('icon', e.target.files?.[0] ?? null)}
                                        />
                                        <p className="mt-2 text-sm text-gray-500">Leave empty to keep the current icon.</p>
                                        <InputError message={errors.icon} className="mt-2" />

                                        {iconPreview ? (
                                            <div className="mt-4">
                                                <p className="mb-2 text-sm font-medium text-gray-700">
                                                    {data.icon ? 'New Preview' : 'Current Icon'}
                                                </p>
                                                <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-2">
                                                    <img src={iconPreview} alt="Category icon preview" className="h-full w-full object-contain" />
                                                </div>
                                            </div>
                                        ) : null}
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton
                                        className="px-6 py-3 bg-[#7267ef] hover:bg-[#6357df] focus:bg-[#6357df] active:bg-[#5e4edb]"
                                        disabled={processing}
                                    >
                                        {processing ? 'Saving...' : 'Save Changes'}
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
