import React, { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  query,
  where,
} from "firebase/firestore";
import { useAuth } from "../../context/UseAuth";
import toast from "react-hot-toast";
import { db } from "../../services/firebase";
import { Link } from "react-router-dom";

const Cart = () => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (currentUser?.uid) {
      fetchCartItems();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const cartRef = collection(db, "cart");
      const q = query(cartRef, where("userId", "==", currentUser?.uid));
      const snapshot = await getDocs(q);
      const cartData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCartItems(cartData);
      console.log('Cart items fetched:', cartData);
    } catch (error) {
      console.error("Error fetching cart items:", error);
      toast.error("Failed to fetch cart items");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await deleteDoc(doc(db, "cart", itemId));
      setCartItems(cartItems.filter((item) => item.id !== itemId));
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Error removing item:", error);
      toast.error("Failed to remove item");
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      // Update in Firebase
      const cartItemRef = doc(db, "cart", itemId);
      const item = cartItems.find(item => item.id === itemId);
      const updatedData = {
        quantity: newQuantity,
        totalPrice: item.unitPrice * newQuantity,
      };
      
      await updateDoc(cartItemRef, updatedData);
      console.log(`Updated quantity for item ${itemId} to ${newQuantity}`);

      // Update local state
      const updatedItems = cartItems.map((item) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: newQuantity,
            totalPrice: item.unitPrice * newQuantity,
          };
        }
        return item;
      });
      setCartItems(updatedItems);
      
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Failed to update quantity");
    }
  };

  const toggleSelectItem = (itemId) => {
    setSelectedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const selectAllItems = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.id));
    }
  };

  const getSelectedItemsTotal = () => {
    return cartItems
      .filter((item) => selectedItems.includes(item.id))
      .reduce((total, item) => total + item.unitPrice * item.quantity, 0);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      toast.error("Please select items to checkout");
      return;
    }
    setShowCheckout(true);
  };

  const placeOrderFromCart = async () => {
    if (!currentUser) {
      toast.error('Please login to place orders');
      return;
    }

    try {
      const selectedCartItems = cartItems.filter((item) =>
        selectedItems.includes(item.id)
      );

      console.log('Placing orders for items:', selectedCartItems);

      // Create orders for each selected item
      const orderPromises = selectedCartItems.map((item) => {
        const orderData = {
          buyerId: currentUser.uid,
          buyerName: `${currentUser.firstName || ''} ${currentUser.lastName || ''}`.trim(),
          buyerEmail: currentUser.email || '',
          sellerId: item.sellerId || 'unknown',
          productId: item.productId || '',
          productName: item.productName || 'Unknown Product',
          productImage: item.productImage || '',
          productSku: item.productSku || '',
          sellerCompany: item.sellerCompany || 'Unknown Company',
          quantity: Number(item.quantity) || 1,
          unitPrice: Number(item.unitPrice) || 0,
          totalAmount: Number(item.unitPrice) * Number(item.quantity) || 0,
          status: "pending",
          createdAt: serverTimestamp(),
        };
        
        console.log('Creating order:', orderData);
        return addDoc(collection(db, "orders"), orderData);
      });

      await Promise.all(orderPromises);
      console.log('All orders created successfully');

      // Remove ordered items from cart
      const deletePromises = selectedItems.map((itemId) =>
        deleteDoc(doc(db, "cart", itemId))
      );
      await Promise.all(deletePromises);
      console.log('Cart items removed successfully');

      // Update local state
      setCartItems(
        cartItems.filter((item) => !selectedItems.includes(item.id))
      );
      setSelectedItems([]);
      setShowCheckout(false);

      toast.success(`${selectedCartItems.length} order(s) placed successfully!`);
      
    } catch (error) {
      console.error("Error placing orders:", error);
      toast.error("Failed to place orders. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-500 mb-6">
              Start shopping to add items to your cart
            </p>
            <Link
              to="/walmart/order"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {/* Select All */}
              <div className="bg-white rounded-lg p-4 flex items-center justify-between">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={
                      selectedItems.length === cartItems.length &&
                      cartItems.length > 0
                    }
                    onChange={selectAllItems}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <span className="font-medium">
                    Select All ({cartItems.length} items)
                  </span>
                </label>
                <span className="text-gray-600">
                  {selectedItems.length} selected
                </span>
              </div>

              {/* Cart Items List */}
              {cartItems.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  isSelected={selectedItems.includes(item.id)}
                  onToggleSelect={() => toggleSelectItem(item.id)}
                  onRemove={() => removeFromCart(item.id)}
                  onUpdateQuantity={(newQuantity) =>
                    updateQuantity(item.id, newQuantity)
                  }
                />
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg p-6 sticky top-4">
                <h3 className="text-lg font-semibold mb-4">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span>Items ({selectedItems.length}):</span>
                    <span>${getSelectedItemsTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping:</span>
                    <span>Free</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${getSelectedItemsTotal().toFixed(2)}</span>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={selectedItems.length === 0}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Proceed to Checkout
                </button>

                <div className="mt-4 text-center">
                  <Link
                    to="/walmart/order"
                    className="text-blue-600 hover:text-blue-700 text-sm"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Fixed Modal with proper backdrop */}
        {showCheckout && (
          <CheckoutModal
            selectedItems={cartItems.filter((item) =>
              selectedItems.includes(item.id)
            )}
            total={getSelectedItemsTotal()}
            onClose={() => setShowCheckout(false)}
            onPlaceOrder={placeOrderFromCart}
          />
        )}
      </div>
    </div>
  );
};

// Fixed Cart Item Component with no image flickering
const CartItem = ({
  item,
  isSelected,
  onToggleSelect,
  onRemove,
  onUpdateQuantity,
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    if (item.productImage && !imageError) {
      setImageLoaded(true);
    }
  };
  const shouldShowPlaceholder = !item.productImage || imageError;

  return (
    <div className="bg-white rounded-lg p-4 flex items-center space-x-4">
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={isSelected}
        onChange={onToggleSelect}
        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
      />

      {/* Product Image - Fixed flickering */}
      <div className="relative w-16 h-16">
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
              src={item.productImage}
              alt={item.productName}
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
        <h3 className="font-semibold text-gray-900">{item.productName || 'Unknown Product'}</h3>
        <p className="text-gray-600">${(item.unitPrice || 0).toFixed(2)} each</p>
        {item.productSku && (
          <p className="text-gray-500 text-sm">SKU: {item.productSku}</p>
        )}
        {item.sellerCompany && (
          <p className="text-gray-500 text-sm">by {item.sellerCompany}</p>
        )}
      </div>

      {/* Quantity Controls */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onUpdateQuantity((item.quantity || 1) - 1)}
          disabled={(item.quantity || 1) <= 1}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          -
        </button>
        <span className="w-12 text-center font-medium">{item.quantity || 1}</span>
        <button
          onClick={() => onUpdateQuantity((item.quantity || 1) + 1)}
          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
        >
          +
        </button>
      </div>

      {/* Total Price */}
      <div className="text-right min-w-[100px]">
        <p className="font-semibold">
          ${((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
        </p>
      </div>

      {/* Remove Button */}
      <button
        onClick={onRemove}
        className="text-red-600 hover:text-red-700 p-2 transition-colors"
        title="Remove from cart"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  );
};

// Fixed Checkout Modal Component - No more black background
const CheckoutModal = ({ selectedItems, total, onClose, onPlaceOrder }) => {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onPlaceOrder();
    } finally {
      setLoading(false);
    }
  };

  // Handle backdrop click to close modal
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Prevent background scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div 
          className="fixed inset-0  bg-opacity-30 backdrop-blur-md flex items-center justify-center z-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Checkout</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="mb-6">
          <h3 className="font-semibold mb-3 text-gray-800">Order Items</h3>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {selectedItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center py-3 border-b border-gray-100"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{item.productName || 'Unknown Product'}</div>
                  <div className="text-sm text-gray-600">
                    Quantity: {item.quantity || 1} × ${(item.unitPrice || 0).toFixed(2)}
                  </div>
                  {item.productSku && (
                    <div className="text-sm text-gray-500">SKU: {item.productSku}</div>
                  )}
                </div>
                <div className="font-semibold text-gray-900">
                  ${((item.unitPrice || 0) * (item.quantity || 1)).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center font-bold text-lg pt-3 border-t border-gray-200">
              <span>Total:</span>
              <span className="text-blue-600">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Simplified Checkout Notice */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="text-blue-600 mt-0.5">ℹ️</div>
            <div>
              <p className="text-blue-800 text-sm font-medium">Simplified Checkout</p>
              <p className="text-blue-700 text-sm mt-1">
                Your orders will be placed with default shipping information. 
                You can track your orders in the "My Orders" section.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {loading ? "Placing Orders..." : `Place ${selectedItems.length} Order(s)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;