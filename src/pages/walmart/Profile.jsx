import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/UseAuth';
import { Edit3, Save, X, CheckCircle, Building, Calendar, Users, Package, TrendingUp, DollarSign, Star, Clock, Truck, CreditCard, Shield } from 'lucide-react';

// Profile Stats Component
const ProfileStats = ({ profileData }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Orders</p>
          <p className="text-3xl font-bold text-gray-900">{profileData.totalOrders}</p>
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
          <Package className="w-6 h-6 text-blue-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 text-blue-500 mr-1" />
        <span className="text-blue-600">+12% from last month</span>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Total Spent</p>
          <p className="text-3xl font-bold text-gray-900">${profileData.totalSpent.toLocaleString()}</p>
        </div>
        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
          <DollarSign className="w-6 h-6 text-green-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
        <span className="text-green-600">+8% from last month</span>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Average Rating</p>
          <p className="text-3xl font-bold text-gray-900">{profileData.averageRating}</p>
        </div>
        <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <span className="text-yellow-600">{profileData.totalReviews} reviews</span>
      </div>
    </div>

    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">Response Time</p>
          <p className="text-3xl font-bold text-gray-900">{profileData.responseTime}</p>
        </div>
        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
          <Clock className="w-6 h-6 text-purple-600" />
        </div>
      </div>
      <div className="mt-4 flex items-center text-sm">
        <CheckCircle className="w-4 h-4 text-purple-500 mr-1" />
        <span className="text-purple-600">Excellent</span>
      </div>
    </div>
  </div>
);

// Profile Information Component
const ProfileInfo = ({ currentUser, profileData, editing, editData, onEdit, onSave, onCancel }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
      {!editing && (
        <button onClick={onEdit} className="flex items-center gap-1 px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">
          <Edit3 className="w-4 h-4" /> Edit Profile
        </button>
      )}
      {editing && (
        <div className="flex gap-2">
          <button onClick={onSave} className="flex items-center gap-1 px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors">
            <Save className="w-4 h-4" /> Save
          </button>
          <button onClick={onCancel} className="flex items-center gap-1 px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4" /> Cancel
          </button>
        </div>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
          {editing ? (
            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => onEdit({ ...editData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{currentUser.firstName || 'N/A'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
          {editing ? (
            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => onEdit({ ...editData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{currentUser.lastName || 'N/A'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          {editing ? (
            <input
              type="email"
              value={editData.email}
              onChange={(e) => onEdit({ ...editData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{currentUser.email}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          {editing ? (
            <input
              type="tel"
              value={editData.phone}
              onChange={(e) => onEdit({ ...editData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{currentUser.phone || 'N/A'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          {editing ? (
            <textarea
              value={editData.address}
              onChange={(e) => onEdit({ ...editData, address: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          ) : (
            <p className="text-gray-900">{currentUser.address || 'N/A'}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
          <p className="text-gray-900">{currentUser.companyName || 'Walmart'}</p>
        </div>
      </div>
    </div>
  </div>
);

// Business Information Component
const BusinessInfo = ({ profileData }) => (
  <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Business Information</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Building className="w-5 h-5 mr-2 text-blue-600" />
          Company Details
        </h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Company:</span> Walmart</p>
          <p><span className="font-medium">Member Since:</span> {profileData.memberSince}</p>
          <p><span className="font-medium">Last Active:</span> {profileData.lastActive}</p>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Truck className="w-5 h-5 mr-2 text-green-600" />
          Shipping Methods
        </h3>
        <div className="space-y-1">
          {profileData.shippingMethods.map((method, index) => (
            <div key={index} className="flex items-center text-sm">
              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
              {method}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-purple-600" />
          Payment Methods
        </h3>
        <div className="space-y-1">
          {profileData.paymentMethods.map((method, index) => (
            <div key={index} className="flex items-center text-sm">
              <Shield className="w-4 h-4 text-purple-500 mr-2" />
              {method}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

// Profile Empty State Component
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

  // Hardcoded data for walmart profile
  const [profileData, setProfileData] = useState({
    totalOrders: 156,
    totalSpent: 45230,
    averageRating: 4.8,
    totalReviews: 89,
    responseTime: "1.2 hours",
    memberSince: "January 2023",
    lastActive: "30 minutes ago",
    shippingMethods: ["Standard", "Express", "Overnight", "Same Day"],
    paymentMethods: ["Credit Card", "Debit Card", "Corporate Account", "Purchase Order"]
  });

  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: currentUser?.firstName || "",
    lastName: currentUser?.lastName || "",
    email: currentUser?.email || "",
    phone: currentUser?.phone || "",
    address: currentUser?.address || ""
  });

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setEditData({
      firstName: currentUser?.firstName || "",
      lastName: currentUser?.lastName || "",
      email: currentUser?.email || "",
      phone: currentUser?.phone || "",
      address: currentUser?.address || ""
    });
  };
  const handleSave = () => {
    // Here you would typically save to Firebase
    setEditing(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userLoggedIn || !currentUser) {
    return <ProfileEmptyState />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Walmart Profile</h1>
          <p className="text-gray-600">Manage your Walmart account and preferences</p>
        </div>

        {/* Profile Stats */}
        <ProfileStats profileData={profileData} />

        {/* Profile Information */}
        <ProfileInfo
          currentUser={currentUser}
          profileData={profileData}
          editing={editing}
          editData={editData}
          onEdit={setEditData}
          onSave={handleSave}
          onCancel={handleCancel}
        />

        {/* Business Information */}
        <BusinessInfo profileData={profileData} />
      </div>
    </div>
  );
};

export default Profile; 