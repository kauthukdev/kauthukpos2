import { Link, Head } from '@inertiajs/react';

export default function Error({ status, message }) {
    const title = {
        503: '503: Service Unavailable',
        500: '500: Server Error',
        404: '404: Page Not Found',
        403: '403: Forbidden',
    }[status];

    const description = {
        503: 'Sorry, we are doing some maintenance. Please check back soon.',
        500: 'Whoops, something went wrong on our servers.',
        404: 'Sorry, the page you are looking for could not be found.',
        403: message || 'Sorry, you are forbidden from accessing this page.',
    }[status];

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-200">
            <Head title={title} />
            <div className="text-center p-6 bg-white dark:bg-gray-800 shadow-xl rounded-lg max-w-lg w-full">
                <h1 className="text-6xl font-bold text-indigo-600 mb-4">{status}</h1>
                <h2 className="text-2xl font-semibold mb-4">{title}</h2>
                <p className="text-lg mb-8 text-gray-600 dark:text-gray-400">{description}</p>

                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition duration-300 font-medium"
                    >
                        Go Back
                    </button>

                    <Link
                        href="/"
                        className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition duration-300 font-medium shadow-md hover:shadow-lg"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
