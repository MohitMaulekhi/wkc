import { Mail, Phone, MapPin, BadgeCheck, Package, ShoppingCart, Star, DollarSign, Clock, TrendingUp, Users, CreditCard, Truck, ArrowRight, User } from "lucide-react";
import { useAuth } from "../context/UseAuth";
import { Link } from "react-router-dom";

// ProfileCard component
const ProfileCard = ({ currentUser, profileData }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">
          {currentUser.firstName?.charAt(0)}{currentUser.lastName?.charAt(0)}
        </span>
      </div>
      <h2 className="text-xl font-semibold text-gray-900">
        {currentUser.firstName} {currentUser.lastName}
      </h2>
      <p className="text-gray-600">{currentUser.companyName || "Independent Seller"}</p>
      <p className="text-sm text-gray-500 mt-1">Member since {profileData.memberSince}</p>
    </div>
    <div className="space-y-3 mb-6">
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="w-4 h-4 mr-2" />
        {currentUser.email}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="w-4 h-4 mr-2" />
        {currentUser.phone || "+1 (555) 123-4567"}
      </div>
      <div className="flex items-start text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2 mt-0.5" />
        <span className="text-xs">{currentUser.address || "123 Business St, City, State 12345"}</span>
      </div>
    </div>
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Certifications</h3>
      <div className="space-y-2">
        {profileData.certifications.map((cert, index) => (
          <div key={index} className="flex items-center text-sm">
            <BadgeCheck className="w-4 h-4 text-green-500 mr-2" />
            {cert}
          </div>
        ))}
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">Business Hours</h3>
      <p className="text-sm text-gray-600">{profileData.businessHours}</p>
    </div>
  </div>
);

// StatsCards component
const StatsCards = ({ profileData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Products</p>
          <p className="text-2xl font-bold text-gray-900">{profileData.totalProducts}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className="p-2 bg-green-100 rounded-lg">
          <ShoppingCart className="w-6 h-6 text-green-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Total Sales</p>
          <p className="text-2xl font-bold text-gray-900">{profileData.totalSales.toLocaleString()}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className="p-2 bg-yellow-100 rounded-lg">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Rating</p>
          <p className="text-2xl font-bold text-gray-900">{profileData.averageRating}</p>
        </div>
      </div>
    </div>
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex items-center">
        <div className="p-2 bg-purple-100 rounded-lg">
          <DollarSign className="w-6 h-6 text-purple-600" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">Revenue</p>
          <p className="text-2xl font-bold text-gray-900">${profileData.totalRevenue.toLocaleString()}</p>
        </div>
      </div>
    </div>
  </div>
);

// SalesChart component (placeholder for now)
const SalesChart = ({ salesChart }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><TrendingUp className="w-5 h-5 mr-2" />Sales (last 6 months)</h3>
    <div className="flex items-end space-x-4 h-32">
      {salesChart.map((data, idx) => (
        <div key={data.month} className="flex flex-col items-center justify-end h-full">
          <div className="w-6 bg-blue-500 rounded-t-lg" style={{ height: `${data.sales / 4}px` }}></div>
          <span className="text-xs text-gray-500 mt-1">{data.month}</span>
        </div>
      ))}
    </div>
  </div>
);

// RecentReviews component
const RecentReviews = ({ recentReviews }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center"><Users className="w-5 h-5 mr-2" />Recent Reviews</h3>
    <div className="space-y-4">
      {recentReviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-4 last:border-b-0">
          <div className="flex items-center mb-1">
            <User className="w-4 h-4 text-blue-500 mr-2" />
            <span className="font-medium text-gray-900 mr-2">{review.customer}</span>
            <span className="text-xs text-gray-500">{review.date}</span>
          </div>
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span className="text-sm text-gray-700 font-semibold mr-2">{review.rating}</span>
            <span className="text-xs text-gray-500">{review.product}</span>
          </div>
          <p className="text-sm text-gray-600">{review.comment}</p>
        </div>
      ))}
    </div>
  </div>
);

// ProfileEmptyState (not used, but for future extensibility)
const ProfileEmptyState = () => (
  <div className="min-h-screen bg-gray-50 flex items-center justify-center">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">No profile data found</h2>
      <Link to="/" className="text-blue-600 hover:text-blue-500">Go to Home</Link>
    </div>
  </div>
);

const Profile = () => {
  const { currentUser, userLoggedIn, loading } = useAuth();

  // Hardcoded data for seller profile
  const profileData = {
    totalProducts: 47,
    totalSales: 2847,
    totalRevenue: 125430,
    averageRating: 4.6,
    totalReviews: 156,
    memberSince: "March 2023",
    lastActive: "2 hours ago",
    completedOrders: 892,
    pendingOrders: 23,
    returnRate: 2.1,
    responseTime: "2.3 hours",
    topCategories: ["Electronics", "Home & Garden", "Sports"],
    certifications: ["Verified Seller", "Fast Shipping", "Quality Assured"],
    businessHours: "Mon-Fri: 9AM-6PM, Sat: 10AM-4PM",
    shippingMethods: ["Standard", "Express", "Overnight"],
    paymentMethods: ["Credit Card", "PayPal", "Bank Transfer"]
  };

  const recentReviews = [
    {
      id: 1,
      customer: "Sarah Johnson",
      rating: 5,
      comment: "Excellent product quality and fast shipping. Highly recommended!",
      date: "2 days ago",
      product: "Wireless Headphones"
    },
    {
      id: 2,
      customer: "Mike Chen",
      rating: 4,
      comment: "Good product, arrived on time. Would buy again.",
      date: "1 week ago",
      product: "Smart Watch"
    },
    {
      id: 3,
      customer: "Emily Davis",
      rating: 5,
      comment: "Amazing customer service and product quality. Thank you!",
      date: "2 weeks ago",
      product: "Bluetooth Speaker"
    }
  ];

  const salesChart = [
    { month: "Jan", sales: 120 },
    { month: "Feb", sales: 150 },
    { month: "Mar", sales: 180 },
    { month: "Apr", sales: 220 },
    { month: "May", sales: 280 },
    { month: "Jun", sales: 320 }
  ];

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Show login prompt if not logged in
  if (!userLoggedIn || !currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in to view your profile</h2>
          <Link to="/login" className="text-blue-600 hover:text-blue-500">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Profile</h1>
          <p className="text-gray-600 mt-2">Manage your business profile and view performance metrics</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <ProfileCard currentUser={currentUser} profileData={profileData} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <StatsCards profileData={profileData} />
            <SalesChart salesChart={salesChart} />
            <RecentReviews recentReviews={recentReviews} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 