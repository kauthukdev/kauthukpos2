import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

const Edit = ({ auth, category }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: category.name
    });

    const submit = (e) => {
        console.log(category);
        e.preventDefault();
        put(route('products.category.update', category.id), {
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