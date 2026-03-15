import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { useState, useEffect } from 'react';

export default function SideBar({ isOpen, setIsOpen, showToggle = true }) {
    const { url } = usePage();
    const [usersMenuOpen, setUsersMenuOpen] = useState(false);
    const [productMenuOpen, setProductMenuOpen] = useState(false);
    const [salesMenuOpen, setSalesMenuOpen] = useState(false);
    const roleID = usePage().props.auth.user.role_id;
    const isAdmin = roleID === 1;
    // Auto expand users menu when on users routes
    useEffect(() => {
        if (url.startsWith('/users')) {
            setUsersMenuOpen(true);
        }
        if (url.startsWith('/product')){
            setProductMenuOpen(true);
        }
        if (url.startsWith('/sales')){
            setSalesMenuOpen(true);
        }
    }, [url]);

    return (
        <>
            {/* Sidebar Toggle Button - Only show if showToggle is true */}
            {showToggle && (
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="fixed left-4 top-4 z-50 rounded-md bg-gray-800 p-2 text-white hover:bg-gray-700"
                >
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        {isOpen ? (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        ) : (
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        )}
                    </svg>
                </button>
            )}

            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 z-45 h-full w-64 transform bg-gray-800 transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                {/* Logo Section */}
                <div className="flex h-16 items-center justify-center border-b border-gray-700">
                    <Link href={route('dashboard')}>
                        <ApplicationLogo className="block h-9 w-auto" />
                    </Link>
                </div>

                <div className="space-y-4 p-4">
                    {/* Dashboard Link */}
                    <Link
                        href={route('dashboard')}
                        className={`group flex items-center rounded-lg px-4 py-2 text-white transition-colors ${
                            route().current('dashboard') ? 'bg-[#7267ef]' : 'hover:bg-gray-700'
                        }`}
                    >
                        <div className="relative">
                            <svg
                                className="mr-3 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                                />
                            </svg>
                        </div>
                        <span>Dashboard</span>
                    </Link>

                    {/* Manage Users Menu */}
                    <div>
                        <button
                            onClick={() => setUsersMenuOpen(!usersMenuOpen)}
                            className={`group flex w-full items-center justify-between rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700 ${
                                url.startsWith('/users') ? 'bg-[#7267ef]' : ''
                            }`}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    <svg
                                        className="mr-3 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <span>Manage Users</span>
                            </div>
                            <svg
                                className={`h-5 w-5 transform transition-transform duration-200 ${
                                    usersMenuOpen ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Users Submenu */}
                        <div
                            className={`mt-2 space-y-2 pl-4 transition-all duration-200 ${
                                usersMenuOpen ? 'block' : 'hidden'
                            }`}
                        >
                            {isAdmin && (
                                <Link
                                    href={route('users.create')}
                                    className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                        route().current('users.create') ? 'bg-gray-700 text-white' : ''
                                    }`}
                                >
                                    Add Users
                                </Link>
                            )}
                            <Link
                                href={route('users.index')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('users.index') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                List Users
                            </Link>
                        </div>
                    </div>

                    {/* Profile Link */}
                    <Link
                        href={route('profile.edit')}
                        className={`group flex items-center rounded-lg px-4 py-2 text-white transition-colors ${
                            route().current('profile.edit') ? 'bg-[#7267ef]' : 'hover:bg-gray-700'
                        }`}
                    >
                        <div className="relative">
                            <svg
                                className="mr-3 h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        </div>
                        <span>Profile</span>
                    </Link>
                    {/* Manage Product Menu */}
                    <div>
                        <button
                            onClick={() => setProductMenuOpen(!productMenuOpen)}
                            className={`group flex w-full items-center justify-between rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700 ${
                                url.startsWith('/product') ? 'bg-[#7267ef]' : ''
                            }`}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    <svg
                                        className="mr-3 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        />
                                    </svg>
                                </div>
                                <span>Manage Products</span>
                            </div>
                            <svg
                                className={`h-5 w-5 transform transition-transform duration-200 ${
                                    productMenuOpen ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Users Submenu */}
                        <div
                            className={`mt-2 space-y-2 pl-4 transition-all duration-200 ${
                                productMenuOpen ? 'block' : 'hidden'
                            }`}
                        >
                            <Link
                                href={route('products.category.index')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('products.category.index') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                Categories
                            </Link>
                            <Link
                                href={route('products.index')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('products.index') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                List Products
                            </Link>
                            <Link
                                href={route('products.create')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('products.create') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                Add Product
                            </Link>
                        </div>
                    </div>

                    {/* Manage Sales Menu */}
                    <div>
                        <button
                            onClick={() => setSalesMenuOpen(!salesMenuOpen)}
                            className={`group flex w-full items-center justify-between rounded-lg px-4 py-2 text-white transition-colors hover:bg-gray-700 ${
                                url.startsWith('/sales') ? 'bg-[#7267ef]' : ''
                            }`}
                        >
                            <div className="flex items-center">
                                <div className="relative">
                                    <svg
                                        className="mr-3 h-5 w-5"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                </div>
                                <span>Manage Sales</span>
                            </div>
                            <svg
                                className={`h-5 w-5 transform transition-transform duration-200 ${
                                    salesMenuOpen ? 'rotate-90' : ''
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M9 5l7 7-7 7"
                                />
                            </svg>
                        </button>

                        {/* Sales Submenu */}
                        <div
                            className={`mt-2 space-y-2 pl-4 transition-all duration-200 ${
                                salesMenuOpen ? 'block' : 'hidden'
                            }`}
                        >
                            <Link
                                href={route('sales.index')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('sales.index') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                List Sales
                            </Link>
                            <Link
                                href={route('sales.create')}
                                className={`block w-full rounded-lg px-4 py-2 text-sm text-gray-300 transition-colors hover:bg-gray-700 hover:text-white ${
                                    route().current('sales.create') ? 'bg-gray-700 text-white' : ''
                                }`}
                            >
                                Add Sale
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
