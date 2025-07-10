import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/UseAuth';
import toast from 'react-hot-toast';
import { 
  Package, 
  ShoppingCart, 
  FileText, 
  BarChart3, 
  Users, 
  Settings, 
  User, 
  ChevronDown, 
  LogOut,
  Menu,
  X
} from 'lucide-react';

function getInitials(firstName, lastName) {
  if (!firstName && !lastName) return 'U';
  if (firstName && lastName) return firstName[0].toUpperCase() + lastName[0].toUpperCase();
  if (firstName) return firstName[0].toUpperCase();
  if (lastName) return lastName[0].toUpperCase();
  return 'U';
}

// Navigation configuration based on user roles
const getNavigationConfig = (userType) => {
  const configs = {
    seller: {
      links: [
        { to: '/seller/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/seller/inventory', label: 'Inventory', icon: 'inventory' },
        { to: '/seller/order', label: 'Order', icon: 'package' },
      ],
      categories: [
        "Electronics", "Clothing", "Home & Garden", "Sports & Outdoors",
        "Books", "Toys & Games", "Health & Beauty", "Automotive"
      ],
      profilePath: '/seller/profile',
      dashboardPath: '/seller/dashboard',
      categoryBasePath: '/seller/category'
    },
    walmart: {
      links: [
        { to: '/walmart/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/walmart/order', label: 'Order', icon: 'package' },
        { to: '/walmart/myOrders', label: 'My Orders', icon: 'Package' },
        { to: '/walmart/cart', label: 'Cart', icon: 'basket' }
      ],
      categories: [],
      profilePath: '/walmart/profile',
      dashboardPath: '/walmart/dashboard',
      categoryBasePath: '/walmart/category'
    },
    admin: {
      links: [
        { to: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { to: '/admin', label: 'Admin Panel', icon: 'admin' },
        { to: '/admin/users', label: 'Manage Users', icon: 'users' },
        { to: '/admin/reports', label: 'Reports', icon: 'reports' }
      ],
      categories: [],
      profilePath: '/admin/profile',
      dashboardPath: '/admin/dashboard',
      categoryBasePath: '/admin/category'
    }
  };

  return configs[userType] || configs.seller;
};

// Icon component for better maintainability
const Icon = ({ name, className = "w-5 h-5" }) => {
  const icons = {
    inventory: <Package className={className} />,
    products: <Package className={className} />,
    orders: <FileText className={className} />,
    dashboard: <BarChart3 className={className} />,
    analytics: <BarChart3 className={className} />,
    suppliers: <Users className={className} />,
    admin: <Settings className={className} />,
    users: <Users className={className} />,
    reports: <FileText className={className} />,
    categories: <Package className={className} />,
    profile: <User className={className} />,
    chevronDown: <ChevronDown className={className} />,
    logout: <LogOut className={className} />,
    package: <Package className={className} />,
    Package: <Package className={className} />,
    basket: <ShoppingCart className={className} />
  };

  return icons[name] || null;
};

const Header = () => {
  const { currentUser, userLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  
  const categoryDropdownRef = useRef(null);
  const profileDropdownRef = useRef(null);

  // Get navigation configuration based on user type
  const navConfig = getNavigationConfig(currentUser?.userType);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    }
    
    if (isCategoryDropdownOpen || isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCategoryDropdownOpen, isProfileDropdownOpen]);

  // Close mobile menu on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/');
      closeAllMenus();
    } catch (error) {
      toast.error('Error logging out ' + error.message);
    }
  };

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsProfileDropdownOpen(false);
    setIsCategoryDropdownOpen(false);
  };

  const handleLogoClick = () => {
    if (userLoggedIn) {
      navigate('/');
    } else {
      navigate('/');
    }
  };

  return (
    <>
      <header className="bg-white shadow-lg border-b border-gray-100 relative z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <button onClick={handleLogoClick} className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="text-xl font-bold text-gray-900">WKC Platform</span>
              </button>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              {userLoggedIn ? (
                <>
                  {/* Dynamic Navigation Links */}
                  {navConfig.links.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <Icon name={link.icon} />
                      <span>{link.label}</span>
                    </Link>
                  ))}

                  {/* Categories Dropdown - Only show if user has categories */}
                  {navConfig.categories.length > 0 && (
                    <div className="relative" ref={categoryDropdownRef}>
                      <button
                        onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                        aria-haspopup="true"
                        aria-expanded={isCategoryDropdownOpen}
                      >
                        <Icon name="categories" />
                        <span>Categories</span>
                        <Icon name="chevronDown" className="w-4 h-4 text-gray-400" />
                      </button>
                      
                      {isCategoryDropdownOpen && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                          {navConfig.categories.map((category) => (
                            <Link
                              key={category}
                              to={`${navConfig.categoryBasePath}/${encodeURIComponent(category)}`}
                              onClick={() => setIsCategoryDropdownOpen(false)}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileDropdownRef}>
                    <button
                      onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                      className="flex items-center space-x-3 bg-gray-50 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {getInitials(currentUser?.firstName, currentUser?.lastName)}
                        </span>
                      </div>
                      <div className="text-sm text-left">
                        <div className="font-medium text-gray-900">
                          {currentUser?.firstName} {currentUser?.lastName}
                        </div>
                        <div className="text-gray-500 text-xs capitalize">
                          {currentUser?.userType} • {currentUser?.companyName}
                        </div>
                      </div>
                      <Icon name="chevronDown" className="w-4 h-4 text-gray-400" />
                    </button>

                    {isProfileDropdownOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <Link
                          to={navConfig.profilePath}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon name="profile" className="w-4 h-4 mr-3" />
                          Profile
                        </Link>
                        <Link
                          to={navConfig.dashboardPath}
                          onClick={() => setIsProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Icon name="dashboard" className="w-4 h-4 mr-3" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Icon name="logout" className="w-4 h-4 mr-3" />
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
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-700 hover:text-blue-600 focus:outline-none focus:text-blue-600 relative z-50"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <>
          {/* Lighter overlay - still provides focus but less aggressive */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          {/* Mobile Menu */}
          <div className="fixed top-16 left-0 right-0 bg-white shadow-lg border-b border-gray-200 z-50 md:hidden max-h-[calc(100vh-4rem)] overflow-y-auto">
            <div className="px-4 py-4">
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
                      <div className="font-medium text-gray-900">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </div>
                      <div className="text-gray-500 text-xs capitalize">
                        {currentUser?.userType} • {currentUser?.companyName}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="space-y-2">
                    {navConfig.links.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                      >
                        <Icon name={link.icon} />
                        <span>{link.label}</span>
                      </Link>
                    ))}

                    {/* Mobile Categories Section - Only show if user has categories */}
                    {navConfig.categories.length > 0 && (
                      <div className="border-t border-gray-100 pt-4 mt-4">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          Browse Categories
                        </div>
                        <div className="grid grid-cols-2 gap-2 px-4 mt-2">
                          {navConfig.categories.map((category) => (
                            <Link
                              key={category}
                              to={`${navConfig.categoryBasePath}/${encodeURIComponent(category)}`}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors text-center"
                            >
                              {category}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <Link
                      to={navConfig.dashboardPath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <Icon name="dashboard" />
                      <span>Dashboard</span>
                    </Link>
                    
                    <Link
                      to={navConfig.profilePath}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                    >
                      <Icon name="profile" />
                      <span>Profile</span>
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-3 w-full text-left text-red-600 hover:text-red-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-red-50"
                    >
                      <Icon name="logout" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-700 hover:text-blue-600 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-gray-50"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block bg-blue-600 text-white px-4 py-3 rounded-lg text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors text-center"
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Header;