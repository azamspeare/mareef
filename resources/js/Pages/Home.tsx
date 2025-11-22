import { Head } from '@inertiajs/react';
import { PageProps } from '@/types';

export default function Home({ auth }: PageProps) {
    return (
        <>
            <Head title="Home" />

            <div className="min-h-screen bg-gray-50">
                <nav className="bg-white shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-xl font-semibold text-gray-900">
                                    Mareff
                                </h1>
                            </div>
                            <div className="flex items-center">
                                {auth.user ? (
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-700">
                                            {auth.user.name}
                                        </span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {auth.user.role}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="flex gap-4">
                                        <a
                                            href="/login"
                                            className="text-sm font-medium text-gray-700 hover:text-gray-900"
                                        >
                                            Log in
                                        </a>
                                        <a
                                            href="/register"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                        >
                                            Register
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>

                <main className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center">
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                Welcome to Mareff
                            </h2>
                            <p className="text-lg text-gray-600 mb-8">
                                A modern writing assignment management system built with Laravel, Inertia.js, and React.
                            </p>

                            {auth.user && (
                                <div className="mt-12">
                                    <div className="bg-white rounded-lg shadow-sm p-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                            Quick Links
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            {auth.user.role === 'teacher' && (
                                                <>
                                                    <a
                                                        href="/writings"
                                                        className="block p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                                                    >
                                                        <h4 className="font-medium text-blue-900">My Writings</h4>
                                                        <p className="text-sm text-blue-700 mt-1">
                                                            Manage your writing assignments
                                                        </p>
                                                    </a>
                                                    <a
                                                        href="/submissions"
                                                        className="block p-4 bg-green-50 rounded-lg hover:bg-green-100 transition"
                                                    >
                                                        <h4 className="font-medium text-green-900">Submissions</h4>
                                                        <p className="text-sm text-green-700 mt-1">
                                                            Review student submissions
                                                        </p>
                                                    </a>
                                                </>
                                            )}
                                            {auth.user.role === 'student' && (
                                                <>
                                                    <a
                                                        href="/assignments"
                                                        className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition"
                                                    >
                                                        <h4 className="font-medium text-purple-900">Assignments</h4>
                                                        <p className="text-sm text-purple-700 mt-1">
                                                            View available writing tasks
                                                        </p>
                                                    </a>
                                                    <a
                                                        href="/my-submissions"
                                                        className="block p-4 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition"
                                                    >
                                                        <h4 className="font-medium text-indigo-900">My Submissions</h4>
                                                        <p className="text-sm text-indigo-700 mt-1">
                                                            Track your submitted work
                                                        </p>
                                                    </a>
                                                </>
                                            )}
                                            <a
                                                href="/profile"
                                                className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                                            >
                                                <h4 className="font-medium text-gray-900">Profile</h4>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    Manage your account settings
                                                </p>
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
}
