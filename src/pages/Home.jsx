import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';

const Home = () => {
    const { userLoggedIn, currentUser } = useAuth();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center">
                    <div className="mb-8">
                        <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <span className="text-white text-3xl font-bold">W</span>
                        </div>
                        <h1 className="text-5xl font-bold text-gray-900 mb-4">
                            Welcome to WKC Platform
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            The ultimate inventory management solution for sellers and Walmart. 
                            Streamline your operations and boost efficiency.
                        </p>
                    </div>

                    {userLoggedIn ? (
                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                                <div className="flex items-center justify-center mb-6">
                                    {currentUser?.photoURL ? (
                                        <img 
                                            src={currentUser.photoURL} 
                                            alt="Profile" 
                                            className="w-16 h-16 rounded-full"
                                        />
                                    ) : (
                                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                                            <span className="text-white text-xl font-bold">
                                                {currentUser?.firstName?.charAt(0) || 'U'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                    Welcome back, {currentUser?.firstName} {currentUser?.lastName}!
                                </h2>
                                <p className="text-gray-600 mb-6">
                                    You are logged in as a <span className="font-semibold text-blue-600">{currentUser?.userType}</span> from <span className="font-semibold">{currentUser?.companyName}</span>
                                </p>
                                
                                <div className="space-y-4">
                                <Link
                                    to="/inventory"
                                    className="inline-flex items-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                    </svg>
                                    <span>Go to Inventory</span>
                                </Link>
                                    
                                    {/* Category Quick Links */}
                                    <div className="mt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Browse Categories</h3>
                                        <div className="grid grid-cols-2 gap-2">
                                            {[
                                                "Electronics", "Clothing", "Home & Garden", "Sports & Outdoors",
                                                "Books", "Toys & Games", "Health & Beauty", "Automotive"
                                            ].map((category) => (
                                                <Link
                                                    key={category}
                                                    to={`/category/${encodeURIComponent(category)}`}
                                                    className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                                                >
                                                    {category}
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-12">
                            {/* Features Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure Authentication</h3>
                                    <p className="text-gray-600">Google OAuth and email-based login for secure access</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Inventory Management</h3>
                                    <p className="text-gray-600">Full CRUD operations for product management</p>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Role-Based Access</h3>
                                    <p className="text-gray-600">Different interfaces for sellers and Walmart</p>
                                </div>
                            </div>

                            {/* Registration Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🏪</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">For Sellers</h3>
                                        <p className="text-gray-600">
                                            Register as a seller to manage your product inventory and connect with Walmart's platform.
                                        </p>
                                    </div>
                                    <Link
                                        to="/register"
                                        className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
                                    >
                                        <span>Register as Seller</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                                
                                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-shadow duration-300">
                                    <div className="text-center mb-6">
                                        <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                            <span className="text-2xl">🛒</span>
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">For Walmart</h3>
                                        <p className="text-gray-600">
                                            Access Walmart's inventory management system and view supplier products.
                                        </p>
                                    </div>
                                    <Link
                                        to="/register"
                                        className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                                    >
                                        <span>Register as Walmart</span>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            
                            <div className="text-center">
                                <p className="text-gray-600 mb-4 text-lg">Already have an account?</p>
                                <Link
                                    to="/login"
                                    className="inline-flex items-center space-x-2 bg-gray-800 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors shadow-lg"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Sign In</span>
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Home