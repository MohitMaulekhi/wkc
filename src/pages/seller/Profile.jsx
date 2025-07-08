import { Mail, Phone, MapPin, BadgeCheck, Package, ShoppingCart, Star, DollarSign, Clock, TrendingUp, Users, CreditCard, Truck, ArrowRight, User, Edit3, Save, Plus, X } from "lucide-react";
import { useAuth } from "../../context/UseAuth";
import { Link } from "react-router-dom";
import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// ProfileCard component
const ProfileCard = ({ currentUser, profileData, editing, editData, setEditData, onEdit, onSave, onCancel, onAddCert, onRemoveCert }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
    <div className="text-center mb-6">
      <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-2xl font-bold text-white">
          {editing ? (editData.firstName?.charAt(0) || "U") : (currentUser.firstName?.charAt(0) || "U")}
        </span>
      </div>
      {editing ? (
        <>
          <input
            className="text-xl font-semibold text-gray-900 text-center mb-1 border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-2"
            value={editData.firstName}
            onChange={e => setEditData(d => ({ ...d, firstName: e.target.value }))}
            placeholder="First Name"
          />
          <input
            className="text-xl font-semibold text-gray-900 text-center mb-1 border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-2 mt-1"
            value={editData.lastName}
            onChange={e => setEditData(d => ({ ...d, lastName: e.target.value }))}
            placeholder="Last Name"
          />
        </>
      ) : (
        <h2 className="text-xl font-semibold text-gray-900">
          {currentUser.firstName} {currentUser.lastName}
        </h2>
      )}
      <p className="text-gray-600">{currentUser.companyName || "Independent Seller"}</p>
      <p className="text-sm text-gray-500 mt-1">Member since {profileData.memberSince}</p>
      <div className="mt-2 flex justify-center gap-2">
        {!editing && (
          <button onClick={onEdit} className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
            <Edit3 className="w-4 h-4" /> Edit Profile
          </button>
        )}
        {editing && (
          <>
            <button onClick={onSave} className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
              <Save className="w-4 h-4" /> Save
            </button>
            <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" /> Cancel
            </button>
          </>
        )}
      </div>
    </div>
    <div className="space-y-3 mb-6">
      <div className="flex items-center text-sm text-gray-600">
        <Mail className="w-4 h-4 mr-2" />
        {editing ? (
          <input
            className="border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-1"
            value={editData.email}
            onChange={e => setEditData(d => ({ ...d, email: e.target.value }))}
            placeholder="Email"
          />
        ) : (
          currentUser.email
        )}
      </div>
      <div className="flex items-center text-sm text-gray-600">
        <Phone className="w-4 h-4 mr-2" />
        {editing ? (
          <input
            className="border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-1"
            value={editData.phone}
            onChange={e => setEditData(d => ({ ...d, phone: e.target.value }))}
            placeholder="Phone"
          />
        ) : (
          currentUser.phone || "+1 (555) 123-4567"
        )}
      </div>
      <div className="flex items-start text-sm text-gray-600">
        <MapPin className="w-4 h-4 mr-2 mt-0.5" />
        {editing ? (
          <input
            className="border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-1 w-full"
            value={editData.address}
            onChange={e => setEditData(d => ({ ...d, address: e.target.value }))}
            placeholder="Address"
          />
        ) : (
          <span className="text-xs">{currentUser.address || "123 Business St, City, State 12345"}</span>
        )}
      </div>
    </div>
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Certifications</h3>
      <div className="space-y-2">
        {editing ? (
          <>
            {editData.certifications.map((cert, idx) => (
              <div key={idx} className="flex items-center text-sm gap-2">
                <BadgeCheck className="w-4 h-4 text-green-500" />
                <input
                  className="border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-1 flex-1"
                  value={cert}
                  onChange={e => setEditData(d => ({ ...d, certifications: d.certifications.map((c, i) => i === idx ? e.target.value : c) }))}
                />
                <button onClick={() => onRemoveCert(idx)} className="text-gray-400 hover:text-red-500"><X className="w-4 h-4" /></button>
              </div>
            ))}
            <button onClick={onAddCert} className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-2">
              <Plus className="w-4 h-4" /> Add Certification
            </button>
          </>
        ) : (
          profileData.certifications.map((cert, index) => (
            <div key={index} className="flex items-center text-sm">
              <BadgeCheck className="w-4 h-4 text-green-500 mr-2" />
              {cert}
            </div>
          ))
        )}
      </div>
    </div>
    <div>
      <h3 className="text-sm font-medium text-gray-900 mb-2">Business Hours</h3>
      {editing ? (
        <input
          className="border-b border-gray-200 focus:outline-none focus:border-blue-400 bg-gray-50 px-1 w-full"
          value={editData.businessHours}
          onChange={e => setEditData(d => ({ ...d, businessHours: e.target.value }))}
          placeholder="Business Hours"
        />
      ) : (
        <p className="text-sm text-gray-600">{profileData.businessHours}</p>
      )}
    </div>
  </div>
);

// StatsCards component (improved alignment)
const StatsCards = ({ profileData }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
      <div className="p-2 bg-blue-100 rounded-lg mb-2">
        <Package className="w-6 h-6 text-blue-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">Total Products</p>
      <p className="text-2xl font-bold text-gray-900">{profileData.totalProducts}</p>
    </div>
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
      <div className="p-2 bg-green-100 rounded-lg mb-2">
        <ShoppingCart className="w-6 h-6 text-green-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">Total Sales</p>
      <p className="text-2xl font-bold text-gray-900">{profileData.totalSales.toLocaleString()}</p>
    </div>
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
      <div className="p-2 bg-yellow-100 rounded-lg mb-2">
        <Star className="w-6 h-6 text-yellow-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">Rating</p>
      <p className="text-2xl font-bold text-gray-900">{profileData.averageRating}</p>
    </div>
    <div className="bg-white rounded-xl shadow border border-gray-100 p-4 flex flex-col items-center">
      <div className="p-2 bg-purple-100 rounded-lg mb-2">
        <DollarSign className="w-6 h-6 text-purple-600" />
      </div>
      <p className="text-sm font-medium text-gray-600">Revenue</p>
      <p className="text-2xl font-bold text-gray-900">${profileData.totalRevenue.toLocaleString()}</p>
    </div>
  </div>
);

// SalesChart using Recharts
const SalesChart = ({ salesChart }) => (
  <div className="bg-white rounded-xl shadow border border-gray-100 p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
      <TrendingUp className="w-5 h-5 mr-2" />Sales (last 6 months)
    </h3>
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={salesChart} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="sales" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
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
  const [profileData, setProfileData] = useState({
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
  });

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: currentUser.firstName || "",
    lastName: currentUser.lastName || "",
    email: currentUser.email || "",
    phone: currentUser.phone || "",
    address: currentUser.address || "",
    certifications: profileData.certifications || [],
    businessHours: profileData.businessHours || ""
  });

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setEditData({
      firstName: currentUser.firstName || "",
      lastName: currentUser.lastName || "",
      email: currentUser.email || "",
      phone: currentUser.phone || "",
      address: currentUser.address || "",
      certifications: profileData.certifications || [],
      businessHours: profileData.businessHours || ""
    });
  };
  const handleSave = () => {
    // In a real app, update backend here
    setEditing(false);
    // Update currentUser fields if needed (not shown here)
    setProfileData(d => ({
      ...d,
      certifications: editData.certifications,
      businessHours: editData.businessHours
    }));
    // Optionally show a toast
  };
  const handleAddCert = () => setEditData(d => ({ ...d, certifications: [...d.certifications, ""] }));
  const handleRemoveCert = idx => setEditData(d => ({ ...d, certifications: d.certifications.filter((_, i) => i !== idx) }));

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-1/3 flex flex-col items-center">
          <ProfileCard
            currentUser={currentUser}
            profileData={profileData}
            editing={editing}
            editData={editData}
            setEditData={setEditData}
            onEdit={handleEdit}
            onSave={handleSave}
            onCancel={handleCancel}
            onAddCert={handleAddCert}
            onRemoveCert={handleRemoveCert}
          />
        </div>
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          <StatsCards profileData={profileData} />
          <SalesChart salesChart={salesChart} />
          <RecentReviews recentReviews={recentReviews} />
        </div>
      </div>
    </div>
  );
};

export default Profile; 