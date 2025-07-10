import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Package, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-12">
                    {/* Hero Section */}
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-5xl font-bold text-gray-900 mb-6">
                            Welcome to <span className="text-blue-600">WKC Platform</span>
                                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            The ultimate inventory management solution connecting sellers with Walmart's ecosystem
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link
                                to="/login"
                                className="inline-flex items-center px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
                                    >
                                <Users className="w-5 h-5 mr-2" />
                                Sign In
                                    </Link>
                                    <Link
                                to="/register"
                                className="inline-flex items-center px-8 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium text-lg shadow-lg hover:shadow-xl"
                                    >
                                <Package className="w-5 h-5 mr-2" />
                                Get Started
                                    </Link>
                                </div>
                            </div>

                    {/* Features Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Secure Authentication</h3>
                            <p className="text-gray-600">Google OAuth and email-based login for secure access to your inventory</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Package className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Inventory Management</h3>
                            <p className="text-gray-600">Full CRUD operations with real-time updates and comprehensive product tracking</p>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-center hover:shadow-2xl transition-shadow duration-300">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Role-Based Access</h3>
                            <p className="text-gray-600">Tailored interfaces for sellers and Walmart users with different capabilities</p>
                        </div>
                    </div>

                    {/* Registration Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 border border-green-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-3xl">🏪</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">For Sellers</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Register as a seller to manage your product inventory, track sales, and connect with Walmart's platform for maximum reach.
                                </p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    Manage product inventory
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    Track sales and analytics
                            </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-green-500 mr-3" />
                                    Connect with Walmart
                                </div>
                            </div>
                            <Link
                                to="/register"
                                className="w-full inline-flex items-center justify-center space-x-2 bg-green-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span>Register as Seller</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:scale-105">
                            <div className="text-center mb-8">
                                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                                    <span className="text-3xl">🛒</span>
                                </div>
                                <h3 className="text-3xl font-bold text-gray-900 mb-4">For Walmart</h3>
                                <p className="text-gray-600 text-lg leading-relaxed">
                                    Access Walmart's inventory management system, view supplier products, and streamline your procurement process.
                                </p>
                            </div>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                                    Browse supplier products
                                </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                                    Manage procurement
                                    </div>
                                <div className="flex items-center text-sm text-gray-600">
                                    <CheckCircle className="w-5 h-5 text-blue-500 mr-3" />
                                    Streamlined ordering
                                </div>
                            </div>
                            <Link
                                to="/register"
                                className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-8 py-4 rounded-xl text-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                <span>Register as Walmart</span>
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;