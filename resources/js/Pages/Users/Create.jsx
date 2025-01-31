import { useForm } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';
import Swal from 'sweetalert2';

export default function Create({ auth, roles }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: '',
    });

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            onSuccess: () => {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'User created successfully',
                    confirmButtonText: 'OK',
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add User</h2>}
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
                                            placeholder="Enter user's name"
                                            required
                                        />
                                        <InputError message={errors.name} className="mt-2" />
                                    </div>

                                    {/* Email */}
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="email" value="Email" className="text-gray-700 text-sm font-bold mb-2" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors"
                                            onChange={(e) => setData('email', e.target.value)}
                                            placeholder="Enter user's email"
                                            required
                                        />
                                        <InputError message={errors.email} className="mt-2" />
                                    </div>

                                    {/* Password */}
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="password" value="Password" className="text-gray-700 text-sm font-bold mb-2" />
                                        <div className="relative">
                                            <TextInput
                                                id="password"
                                                type={passwordVisible ? 'text' : 'password'}
                                                name="password"
                                                value={data.password}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors"
                                                onChange={(e) => setData('password', e.target.value)}
                                                placeholder="Enter password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                            >
                                                {passwordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password} className="mt-2" />
                                    </div>

                                    {/* Confirm Password */}
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="password_confirmation" value="Confirm Password" className="text-gray-700 text-sm font-bold mb-2" />
                                        <div className="relative">
                                            <TextInput
                                                id="password_confirmation"
                                                type={confirmPasswordVisible ? 'text' : 'password'}
                                                name="password_confirmation"
                                                value={data.password_confirmation}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors"
                                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                                placeholder="Confirm password"
                                                required
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                                            >
                                                {confirmPasswordVisible ? (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                    </svg>
                                                ) : (
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        <InputError message={errors.password_confirmation} className="mt-2" />
                                    </div>

                                    {/* Roles Selection */}
                                    <div className="col-span-1">
                                        <InputLabel htmlFor="roles" value="Role" className="text-gray-700 text-sm font-bold mb-2" />
                                        <select
                                            id="roles"
                                            name="roles"
                                            value={data.roles}
                                            onChange={(e) => setData('roles', e.target.value)}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-[#7267ef] focus:ring focus:ring-[#7267ef] focus:ring-opacity-50 transition-colors"
                                            required
                                        >
                                            <option value="">Select a role</option>
                                            {roles.map((role) => (
                                                <option key={role.id} value={role.id}>
                                                    {role.name}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.roles} className="mt-2" />
                                    </div>
                                </div>

                                <div className="flex justify-end mt-6">
                                    <PrimaryButton
                                        className="px-6 py-3 bg-[#7267ef] hover:bg-[#6357df] focus:bg-[#6357df] active:bg-[#5e4edb]"
                                        disabled={processing}
                                    >
                                        {processing ? 'Creating...' : 'Create User'}
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