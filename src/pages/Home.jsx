import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import { 
  Package, 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  Plus, 
  Eye, 
  Edit, 
  Clock, 
  Star, 
  ShoppingCart,
  Users,
  Building,
  Calendar,
  ArrowRight,
  BarChart3,
  Settings,
  User,
  Tag,
  CheckCircle,
  Activity
} from 'lucide-react';

const Home = () => {
    const { userLoggedIn, currentUser } = useAuth();
    const [userStats, setUserStats] = useState({
        totalProducts: 0,
        totalValue: 0,
        lowStockItems: 0,
        recentActivity: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userLoggedIn && currentUser) {
            fetchUserStats();
        }
    }, [userLoggedIn, currentUser]);

    const fetchUserStats = async () => {
        if (!currentUser?.uid) return;
        
        setLoading(true);
        try {
            const productsRef = collection(db, "products");
            const q = query(productsRef, where("userId", "==", currentUser.uid));
            const querySnapshot = await getDocs(q);
            
            const products = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            const totalProducts = products.length;
            const totalValue = products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
            const lowStockItems = products.filter(product => product.quantity < 10).length;

            // Get recent products (last 5)
            const recentProducts = products
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5);

            setUserStats({
                totalProducts,
                totalValue,
                lowStockItems,
                recentActivity: recentProducts
            });
        } catch (error) {
            console.error("Error fetching user stats:", error);
        } finally {
            setLoading(false);
        }
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    const categories = [
        { name: "Electronics", icon: "📱", color: "bg-blue-100 text-blue-600" },
        { name: "Clothing", icon: "👕", color: "bg-purple-100 text-purple-600" },
        { name: "Home & Garden", icon: "🏠", color: "bg-green-100 text-green-600" },
        { name: "Sports & Outdoors", icon: "⚽", color: "bg-orange-100 text-orange-600" },
        { name: "Books", icon: "📚", color: "bg-red-100 text-red-600" },
        { name: "Toys & Games", icon: "🎮", color: "bg-pink-100 text-pink-600" },
        { name: "Health & Beauty", icon: "💄", color: "bg-indigo-100 text-indigo-600" },
        { name: "Automotive", icon: "🚗", color: "bg-gray-100 text-gray-600" }
    ];

    const quickActions = [
        {
            title: "Add New Product",
            description: "Create a new product listing",
            icon: Plus,
            link: "/inventory",
            color: "bg-blue-500 hover:bg-blue-600",
            badge: "Primary"
        },
        {
            title: "View Inventory",
            description: "Manage your product catalog",
            icon: Package,
            link: "/inventory",
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            title: "Browse Categories",
            description: "Explore products by category",
            icon: Tag,
            link: "/",
            color: "bg-purple-500 hover:bg-purple-600"
        },
        {
            title: "Profile Settings",
            description: "Update your account information",
            icon: Settings,
            link: "/profile",
            color: "bg-gray-500 hover:bg-gray-600"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {userLoggedIn ? (
                    <div className="space-y-8">
                        {/* Welcome Header */}
                        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                                <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center">
                                        {currentUser?.photoURL ? (
                                            <img 
                                                src={currentUser.photoURL} 
                                                alt="Profile" 
                                                className="w-16 h-16 rounded-2xl object-cover"
                                            />
                                        ) : (
                                            <span className="text-white text-2xl font-bold">
                                                {currentUser?.firstName?.charAt(0) || 'U'}
                                            </span>
                                        )}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900">
                                            {getGreeting()}, {currentUser?.firstName}!
                                        </h1>
                                        <p className="text-gray-600 text-lg">
                                            Welcome back to your {currentUser?.userType === 'walmart' ? 'Walmart' : 'Seller'} dashboard
                                        </p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                            <div className="flex items-center">
                                                <Building className="w-4 h-4 mr-1" />
                                                {currentUser?.companyName}
                                            </div>
                                            <div className="flex items-center">
                                                <Calendar className="w-4 h-4 mr-1" />
                                                {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Member'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-3">
                                    <Link
                                        to="/inventory"
                                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Product
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Products</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {loading ? '...' : userStats.totalProducts}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Package className="w-6 h-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                                    <span className="text-green-600">Active inventory</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Total Value</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            ${loading ? '...' : userStats.totalValue.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <DollarSign className="w-6 h-6 text-green-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <BarChart3 className="w-4 h-4 text-blue-500 mr-1" />
                                    <span className="text-blue-600">Inventory worth</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">Low Stock</p>
                                        <p className="text-3xl font-bold text-gray-900">
                                            {loading ? '...' : userStats.lowStockItems}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                        <AlertTriangle className="w-6 h-6 text-orange-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <Clock className="w-4 h-4 text-orange-500 mr-1" />
                                    <span className="text-orange-600">Needs attention</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600">User Type</p>
                                        <p className="text-3xl font-bold text-gray-900 capitalize">
                                            {currentUser?.userType || 'Seller'}
                                        </p>
                                    </div>
                                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Users className="w-6 h-6 text-purple-600" />
                                    </div>
                                </div>
                                <div className="mt-4 flex items-center text-sm">
                                    <CheckCircle className="w-4 h-4 text-purple-500 mr-1" />
                                    <span className="text-purple-600">Verified account</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions and Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Quick Actions</h2>
                                <div className="space-y-4">
                                    {quickActions.map((action, index) => (
                                        <Link
                                            key={index}
                                            to={action.link}
                                            className={`flex items-center p-4 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 ${action.color.includes('blue') ? 'hover:border-blue-200' : 'hover:border-gray-200'}`}
                                        >
                                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} text-white mr-4`}>
                                                <action.icon className="w-6 h-6" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                                    {action.badge && (
                                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                                                            {action.badge}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600">{action.description}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-gray-400" />
                                        </Link>
                                    ))}
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
                                {loading ? (
                                    <div className="space-y-4">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="animate-pulse">
                                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                            </div>
                                        ))}
                                    </div>
                                ) : userStats.recentActivity.length > 0 ? (
                                    <div className="space-y-4">
                                        {userStats.recentActivity.map((product) => (
                                            <div key={product.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                    <Package className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-gray-900">{product.name}</h4>
                                                    <p className="text-sm text-gray-600">
                                                        ${product.price} • Qty: {product.quantity}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-gray-500">
                                                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                                    </p>
                                                    <Link
                                                        to={`/product/${product.id}`}
                                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                                    >
                                                        View
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">No products yet</p>
                                        <Link
                                            to="/inventory"
                                            className="inline-flex items-center mt-2 text-blue-600 hover:text-blue-700 font-medium"
                                        >
                                            Add your first product
                                            <ArrowRight className="w-4 h-4 ml-1" />
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Categories Grid */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Browse Categories</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {categories.map((category) => (
                                    <Link
                                        key={category.name}
                                        to={`/category/${encodeURIComponent(category.name)}`}
                                        className="group p-4 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200 text-center"
                                    >
                                        <div className="text-3xl mb-2">{category.icon}</div>
                                        <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                            {category.name}
                                        </h3>
                                        <div className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                                            Browse
                                        </div>
                                    </Link>
                                ))}
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
    );
};

export default Home;