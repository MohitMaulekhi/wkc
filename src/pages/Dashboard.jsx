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
  Activity,
  Smartphone,
  Shirt,
  Home,
  Trophy,
  BookOpen,
  Gamepad2,
  Sparkles,
  Car
} from 'lucide-react';

const Dashboard = () => {
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
        { name: "Electronics", icon: Smartphone, color: "bg-blue-100 text-blue-600" },
        { name: "Clothing", icon: Shirt, color: "bg-purple-100 text-purple-600" },
        { name: "Home & Garden", icon: Home, color: "bg-green-100 text-green-600" },
        { name: "Sports & Outdoors", icon: Trophy, color: "bg-orange-100 text-orange-600" },
        { name: "Books", icon: BookOpen, color: "bg-red-100 text-red-600" },
        { name: "Toys & Games", icon: Gamepad2, color: "bg-pink-100 text-pink-600" },
        { name: "Health & Beauty", icon: Sparkles, color: "bg-indigo-100 text-indigo-600" },
        { name: "Automotive", icon: Car, color: "bg-gray-100 text-gray-600" }
    ];

    const quickActions = [
        {
            title: "Add New Product",
            description: "Create a new product listing",
            icon: Plus,
            link: `/${currentUser?.userType || 'seller'}/inventory`,
            color: "bg-blue-500 hover:bg-blue-600",
            badge: "Primary"
        },
        {
            title: "View Inventory",
            description: "Manage your product catalog",
            icon: Package,
            link: `/${currentUser?.userType || 'seller'}/inventory`,
            color: "bg-green-500 hover:bg-green-600"
        },
        {
            title: "Browse Categories",
            description: "Explore products by category",
            icon: Tag,
            link: `/${currentUser?.userType || 'seller'}/inventory`,
            color: "bg-purple-500 hover:bg-purple-600"
        },
        {
            title: "Profile Settings",
            description: "Update your account information",
            icon: Settings,
            link: `/${currentUser?.userType || 'seller'}/profile`,
            color: "bg-gray-500 hover:bg-gray-600"
        },
        {
            title: "Analytics Dashboard",
            description: "View sales and performance metrics",
            icon: BarChart3,
            link: `/${currentUser?.userType || 'seller'}/profile`,
            color: "bg-indigo-500 hover:bg-indigo-600"
        },
        {
            title: currentUser?.userType === 'walmart' ? "Place Order" : "Chat Support",
            description: currentUser?.userType === 'walmart' ? "Order products from sellers" : "Get help from our AI assistant",
            icon: currentUser?.userType === 'walmart' ? ShoppingCart : Users,
            link: currentUser?.userType === 'walmart' ? `/${currentUser?.userType}/order` : "/",
            color: "bg-pink-500 hover:bg-pink-600"
        }
    ];

    // Redirect if not logged in
    if (!userLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                    <p className="text-gray-600 mb-6">Please log in to access your dashboard.</p>
                    <Link
                        to="/login"
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <User className="w-4 h-4 mr-2" />
                        Sign In
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-8">
                    {/* Welcome Header */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
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
                                            {currentUser?.companyName || 'Independent Seller'}
                                        </div>
                                        <div className="flex items-center">
                                            <Calendar className="w-4 h-4 mr-1" />
                                            Member since {currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'Recently'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex space-x-3">
                                <Link
                                    to={`/${currentUser?.userType || 'seller'}/inventory`}
                                    className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Product
                                </Link>
                                <Link
                                    to={`/${currentUser?.userType || 'seller'}/profile`}
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
                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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

                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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

                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
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

                        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">Account Status</p>
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
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Activity className="w-5 h-5 mr-2 text-blue-600" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        to={action.link}
                                        className={`flex items-center p-4 rounded-xl border border-gray-100 hover:shadow-lg hover:scale-105 transition-all duration-300 ${action.color.includes('blue') ? 'hover:border-blue-200' : 'hover:border-gray-200'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${action.color} text-white mr-4 shadow-lg`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                                                {action.badge && (
                                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full font-medium">
                                                        {action.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-sm text-gray-600">{action.description}</p>
                                        </div>
                                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-green-600" />
                                Recent Activity
                            </h2>
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
                                        <div key={product.id} className="flex items-center space-x-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:shadow-md transition-all duration-200">
                                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center shadow-sm">
                                                <Package className="w-6 h-6 text-blue-600" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-gray-900">{product.name}</h4>
                                                <p className="text-sm text-gray-600">
                                                    ${product.price} • Qty: {product.quantity}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <Link
                                                    to={`/${currentUser?.userType || 'seller'}/product/${product.id}`}
                                                    className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                                                >
                                                    View
                                                    <ArrowRight className="w-4 h-4 ml-1" />
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
                                        to={`/${currentUser?.userType || 'seller'}/inventory`}
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
                        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <Tag className="w-5 h-5 mr-2 text-purple-600" />
                            Browse Categories
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {categories.map((category) => (
                                <Link
                                    key={category.name}
                                    to={`/${currentUser?.userType || 'seller'}/category/${encodeURIComponent(category.name)}`}
                                    className="group p-6 rounded-xl border border-gray-100 hover:border-gray-200 hover:shadow-lg hover:scale-105 transition-all duration-300 text-center bg-gradient-to-br from-gray-50 to-white"
                                >
                                    <div className="mb-3 transform group-hover:scale-110 transition-transform duration-300 flex justify-center">
                                        <category.icon className="w-10 h-10 text-gray-600" />
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                        {category.name}
                                    </h3>
                                    <div className={`inline-block px-4 py-2 rounded-full text-xs font-medium ${category.color} shadow-sm`}>
                                        Browse Products
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 