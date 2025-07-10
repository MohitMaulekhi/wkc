import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, doc, updateDoc, } from 'firebase/firestore';
import { useAuth } from '../../context/UseAuth';
import toast from 'react-hot-toast';
import { db } from '../../services/firebase';
import { Link } from 'react-router-dom';
import { Package, Search, Camera, CheckCircle, XCircle, Truck, AlertTriangle } from 'lucide-react';

const SellerOrders = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [processingOrderId, setProcessingOrderId] = useState(null);
  
  const statusOptions = [
    { value: 'all', label: 'All Orders', color: 'gray' },
    { value: 'pending', label: 'Pending', color: 'yellow' },
    { value: 'confirmed', label: 'Confirmed', color: 'blue' },
    { value: 'shipped', label: 'Shipped', color: 'purple' },
    { value: 'delivered', label: 'Delivered', color: 'green' },
    { value: 'declined', label: 'Declined', color: 'red' }
  ];

  useEffect(() => {
    if (currentUser?.uid) {
      fetchSellerOrders();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const fetchSellerOrders = async () => {
    try {
      setLoading(true);
      const ordersRef = collection(db, 'orders');
      const q = query(
        ordersRef, 
        where('sellerId', '==', currentUser?.uid)
      );
      
      const snapshot = await getDocs(q);
      
      const ordersData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      
      // Sort by date (newest first)
      ordersData.sort((a, b) => b.createdAt - a.createdAt);
      
      setOrders(ordersData);
      console.log('Seller orders fetched:', ordersData);
    } catch (error) {
      console.error('Error fetching seller orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!currentUser) {
      toast.error('Please login to update orders');
      return;
    }
    
    setProcessingOrderId(orderId);
    
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { 
        status: newStatus,
        updatedAt: new Date()
      });
      
      // Update local state
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
      
      toast.success(`Order ${newStatus} successfully!`);
      
      // Close modal if open
      if (showDetails && selectedOrder?.id === orderId) {
        setSelectedOrder({...selectedOrder, status: newStatus});
      }
    } catch (error) {
      console.error(`Error updating order status to ${newStatus}:`, error);
      toast.error(`Failed to update order status to ${newStatus}`);
    } finally {
      setProcessingOrderId(null);
    }
  };

  const confirmOrder = (orderId) => {
    updateOrderStatus(orderId, 'confirmed');
  };
  
  const declineOrder = (orderId) => {
    if (window.confirm("Are you sure you want to decline this order?")) {
      updateOrderStatus(orderId, 'declined');
    }
  };
  
  const markAsShipped = (orderId) => {
    updateOrderStatus(orderId, 'shipped');
  };
  
  const markAsDelivered = (orderId) => {
    updateOrderStatus(orderId, 'delivered');
  };

  const filteredOrders = filter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filter);

  const getStatusColor = (status) => {
    const statusConfig = statusOptions.find(opt => opt.value === status);
    return statusConfig?.color || 'gray';
  };

  const getStatusBadge = (status) => {
    const color = getStatusColor(status);
    const colorClasses = {
      gray: 'bg-gray-100 text-gray-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      blue: 'bg-blue-100 text-blue-800',
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800'
    };

    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color]}`}>
        {status?.charAt(0).toUpperCase() + status?.slice(1) || 'Unknown'}
      </span>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowDetails(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Manage Orders</h1>
            <div className="flex space-x-4">
              <button
                onClick={fetchSellerOrders}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                🔄 Refresh
              </button>
              <Link
                to="/seller/inventory"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Manage Inventory
              </Link>
            </div>
          </div>
          
          {/* Order Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              <div className="text-sm text-gray-600">Total Orders</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-yellow-600">
                {orders.filter(o => o.status === 'pending').length}
              </div>
              <div className="text-sm text-gray-600">Pending</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-blue-600">
                {orders.filter(o => o.status === 'confirmed').length}
              </div>
              <div className="text-sm text-gray-600">Confirmed</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-green-600">
                {orders.filter(o => o.status === 'delivered').length}
              </div>
              <div className="text-sm text-gray-600">Delivered</div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <div className="text-2xl font-bold text-red-600">
                {orders.filter(o => o.status === 'declined').length}
              </div>
              <div className="text-sm text-gray-600">Declined</div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                  {option.value !== 'all' && (
                    <span className="ml-2 px-2 py-0.5 bg-white bg-opacity-20 rounded-full text-xs">
                      {orders.filter(o => o.status === option.value).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6">
              You haven't received any orders yet. Orders placed for your products will appear here.
            </p>
            <Link
              to="/seller/inventory"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Manage Your Inventory
            </Link>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Orders Found</h2>
            <p className="text-gray-500 mb-6">
              No orders found with the selected filter.
            </p>
            <button
              onClick={() => setFilter('all')}
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Show All Orders
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map(order => (
              <SellerOrderCard
                key={order.id}
                order={order}
                onViewDetails={() => handleViewDetails(order)}
                onConfirm={() => confirmOrder(order.id)}
                onDecline={() => declineOrder(order.id)}
                onMarkShipped={() => markAsShipped(order.id)}
                onMarkDelivered={() => markAsDelivered(order.id)}
                getStatusBadge={getStatusBadge}
                formatDate={formatDate}
                isProcessing={processingOrderId === order.id}
              />
            ))}
          </div>
        )}

        {/* Order Details Modal */}
        {showDetails && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowDetails(false)}
            onConfirm={() => confirmOrder(selectedOrder.id)}
            onDecline={() => declineOrder(selectedOrder.id)}
            onMarkShipped={() => markAsShipped(selectedOrder.id)}
            onMarkDelivered={() => markAsDelivered(selectedOrder.id)}
            getStatusBadge={getStatusBadge}
            formatDate={formatDate}
            isProcessing={processingOrderId === selectedOrder.id}
          />
        )}
      </div>
    </div>
  );
};

// Seller Order Card Component
const SellerOrderCard = ({ 
  order, 
  onViewDetails, 
  onConfirm, 
  onDecline, 
  onMarkShipped,
  onMarkDelivered,
  getStatusBadge, 
  formatDate,
  isProcessing
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    if (order.productImage && !imageError) {
      setImageLoaded(true);
    }
  };

  const shouldShowPlaceholder = !order.productImage || imageError;

  const renderActionButtons = () => {
    if (isProcessing) {
      return (
        <div className="flex-shrink-0 flex items-center justify-center h-10 w-full">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-sm text-gray-600">Processing...</span>
        </div>
      );
    }

    switch (order.status) {
      case 'pending':
        return (
          <div className="flex flex-col space-y-2">
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
            >
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-1" />
                Confirm Order
              </div>
            </button>
            <button
              onClick={onDecline}
              className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
            >
              <div className="flex items-center justify-center">
                <XCircle className="w-4 h-4 mr-1" />
                Decline Order
              </div>
            </button>
          </div>
        );
      
      case 'confirmed':
        return (
          <button
            onClick={onMarkShipped}
            className="px-4 py-2 bg-purple-600 text-white text-sm rounded-lg hover:bg-purple-700 transition-colors"
          >
            <div className="flex items-center justify-center">
              <Truck className="w-4 h-4 mr-1" />
              Mark as Shipped
            </div>
          </button>
        );
      
      case 'shipped':
        return (
          <button
            onClick={onMarkDelivered}
            className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
          >
            <div className="flex items-center justify-center">
              <CheckCircle className="w-4 h-4 mr-1" />
              Mark as Delivered
            </div>
          </button>
        );
      
      default:
        return (
          <button
            onClick={onViewDetails}
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-sm text-gray-600">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">
            ${(order.totalAmount || 0).toFixed(2)}
          </div>
          <div className="text-sm text-gray-600">
            Qty: {order.quantity || 1}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0">
        <div className="flex items-center space-x-4 flex-grow">
          {/* Product Image */}
          <div className="relative w-16 h-16 flex-shrink-0">
            {shouldShowPlaceholder ? (
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <div className="text-2xl mb-1">📷</div>
                  <div className="text-xs">No Image</div>
                </div>
              </div>
            ) : (
              <>
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="animate-pulse text-gray-400 text-xs">Loading...</div>
                  </div>
                )}
                <img
                  src={order.productImage}
                  alt={order.productName}
                  className={`w-16 h-16 object-cover rounded-lg transition-opacity duration-200 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                />
              </>
            )}
          </div>

          {/* Product Info */}
          <div className="flex-1">
            <h4 className="font-medium text-gray-900 mb-1">
              {order.productName || 'Unknown Product'}
            </h4>
            <p className="text-sm text-gray-600">
              ${(order.unitPrice || 0).toFixed(2)} each
            </p>
            {order.productSku && (
              <p className="text-sm text-gray-500">SKU: {order.productSku}</p>
            )}
          </div>
        </div>

        {/* Buyer Info */}
        <div className="flex-shrink-0 md:mx-4 md:border-l md:border-r md:px-4 py-1">
          <div className="text-sm">
            <p className="font-medium text-gray-900">Buyer:</p>
            <p className="text-gray-600">{order.buyerName || 'Unknown'}</p>
            <p className="text-gray-600">{order.buyerEmail || 'No email'}</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex-shrink-0 md:ml-4 min-w-[150px]">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

// Order Details Modal Component
const OrderDetailsModal = ({ 
  order, 
  onClose, 
  onConfirm, 
  onDecline,
  onMarkShipped,
  onMarkDelivered,
  getStatusBadge, 
  formatDate,
  isProcessing
}) => {
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const renderActionButtons = () => {
    if (isProcessing) {
      return (
        <div className="flex-1 px-4 py-3 bg-gray-200 rounded-lg flex justify-center items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600 mr-2"></div>
          <span>Processing...</span>
        </div>
      );
    }

    switch (order.status) {
      case 'pending':
        return (
          <>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Confirm Order
              </div>
            </button>
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
            >
              <div className="flex items-center justify-center">
                <XCircle className="w-4 h-4 mr-2" />
                Decline Order
              </div>
            </button>
          </>
        );
      
      case 'confirmed':
        return (
          <>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={onMarkShipped}
              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              <div className="flex items-center justify-center">
                <Truck className="w-4 h-4 mr-2" />
                Mark as Shipped
              </div>
            </button>
          </>
        );
      
      case 'shipped':
        return (
          <>
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Close
            </button>
            <button
              onClick={onMarkDelivered}
              className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              <div className="flex items-center justify-center">
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark as Delivered
              </div>
            </button>
          </>
        );
      
      default:
        return (
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Close
          </button>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Order Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Header */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Order #{order.id.slice(-8).toUpperCase()}
              </h3>
              <p className="text-sm text-gray-600">
                <strong>Placed:</strong> {formatDate(order.createdAt)}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Status:</strong> {getStatusBadge(order.status)}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600 mb-2">
                ${(order.totalAmount || 0).toFixed(2)}
              </div>
              <p className="text-sm text-gray-600">Total Amount</p>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Product Information</h4>
          <div className="flex items-start space-x-4">
            <img
              src={order.productImage || "/api/placeholder/80/80"}
              alt={order.productName}
              className="w-20 h-20 object-cover rounded-lg"
              onError={(e) => {
                e.target.src = "/api/placeholder/80/80";
              }}
            />
            <div className="flex-1">
              <h5 className="font-medium text-gray-900 mb-2">
                {order.productName || 'Unknown Product'}
              </h5>
              <div className="space-y-1 text-sm text-gray-600">
                <p><strong>SKU:</strong> {order.productSku || 'N/A'}</p>
                <p><strong>Unit Price:</strong> ${(order.unitPrice || 0).toFixed(2)}</p>
                <p><strong>Quantity:</strong> {order.quantity || 1}</p>
                <p><strong>Your Company:</strong> {order.sellerCompany || 'Your Store'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Buyer Information */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Buyer Information</h4>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Name:</strong> {order.buyerName || 'N/A'}</p>
            <p><strong>Email:</strong> {order.buyerEmail || 'N/A'}</p>
            <p><strong>Order ID:</strong> {order.id}</p>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="border rounded-lg p-4 mb-6">
          <h4 className="font-semibold text-gray-900 mb-4">Order Timeline</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="text-sm">
                <span className="font-medium">Order Placed</span>
                <span className="text-gray-500 ml-2">{formatDate(order.createdAt)}</span>
              </div>
            </div>
            {order.status === 'confirmed' && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Order Confirmed</span>
                </div>
              </div>
            )}
            {order.status === 'shipped' && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Order Shipped</span>
                </div>
              </div>
            )}
            {order.status === 'delivered' && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Order Delivered</span>
                </div>
              </div>
            )}
            {order.status === 'declined' && (
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <div className="text-sm">
                  <span className="font-medium">Order Declined</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          {renderActionButtons()}
        </div>
      </div>
    </div>
  );
};

export default SellerOrders;