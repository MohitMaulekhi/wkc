import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';
import toast from 'react-hot-toast';

function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return 'U';
  if (firstName && lastName) return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  return 'U';
}

const Header = () => {
  const { currentUser, userLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryDropdownOpen]);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
      setIsMobileMenuOpen(false);
      setIsProfileDropdownOpen(false);
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const toggleCategoryDropdown = () => {
    setIsCategoryDropdownOpen(!isCategoryDropdownOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WKC Platform</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {userLoggedIn ? (
              <>
                <Link
                  to="/inventory"
                  className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  <span>Inventory</span>
                </Link>

                {/* Categories Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    onClick={() => setIsCategoryDropdownOpen((v) => !v)}
                    className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                    aria-haspopup="true"
                    aria-expanded={isCategoryDropdownOpen}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <span>Categories</span>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      {["Electronics", "Clothing", "Home & Garden", "Sports & Outdoors", "Books", "Toys & Games", "Health & Beauty", "Automotive", "Tools & Hardware", "Food & Beverages", "Pet Supplies", "Office Supplies"].map((category) => (
                        <Link
                          key={category}
                          to={`/category/${encodeURIComponent(category)}`}
                          onClick={() => setIsCategoryDropdown(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={toggleProfileDropdown}
                    className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {getInitials(currentUser?.firstName, currentUser?.lastName)}
                      </span>
                    </div>
                    <div className="text-sm text-left">
                      <div className="font-medium text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</div>
                      <div className="text-gray-500 text-xs">{currentUser?.userType} • {currentUser?.companyName}</div>
                    </div>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileDropdown(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            {userLoggedIn ? (
              <div className="space-y-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 bg-gray-50 px-4 py-3 rounded-lg">
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials(currentUser?.firstName, currentUser?.lastName)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{currentUser?.firstName} {currentUser?.lastName}</div>
                    <div className="text-gray-500 text-xs">{currentUser?.userType} • {currentUser?.companyName}</div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  <Link
                    to="/inventory"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span>Inventory</span>
                  </Link>

                  {/* Mobile Categories Section */}
                  <div className="border-t border-gray-100 pt-4">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Browse Categories
                    </div>
                    <div className="grid grid-cols-2 gap-2 px-4">
                      {[
                        "Electronics", "Clothing", "Home & Garden", "Sports & Outdoors",
                        "Books", "Toys & Games", "Health & Beauty", "Automotive"
                      ].map((category) => (
                        <Link
                          key={category}
                          to={`/category/${encodeURIComponent(category)}`}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                  
                  <Link
                    to="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>Profile</span>
                  </Link>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full text-left text-red-600 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  to="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-gray-700 hover:text-blue-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Overlay for category dropdown */}
      {isCategoryDropdownOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-25 z-40"
          onClick={() => setIsCategoryDropdown(false)}
        />
      )}
    </header>
  );
};

export default Header;