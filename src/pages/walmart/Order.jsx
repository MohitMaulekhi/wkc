import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../context/UseAuth';
import toast from 'react-hot-toast';
import { db } from '../../services/firebase';
import { Package, Search, Camera } from 'lucide-react';

const Order = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const categories = [
    'all', 'Electronics', 'Clothing', 'Home & Garden', 'Sports & Outdoors',
    'Books', 'Toys & Games', 'Health & Beauty', 'Automotive', 'Food & Beverages'
  ];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter and sort products
  useEffect(() => {
    let filtered = [...products];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(product =>
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.name || '').localeCompare(b.name || '');
        case 'price-low':
          return (a.price || 0) - (b.price || 0);
        case 'price-high':
          return (b.price || 0) - (a.price || 0);
        case 'stock':
          return (b.quantity || 0) - (a.quantity || 0);
        default:
          return 0;
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, sortBy]);

  const fetchProducts = async () => {
    try {
      console.log('Starting to fetch products...');
      setLoading(true);
      
      const productsRef = collection(db, 'products');
      const snapshot = await getDocs(productsRef);
      
      console.log('Products snapshot size:', snapshot.size);
      
      const productsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          name: data.name || 'Unnamed Product',
          price: Number(data.price) || 0,
          quantity: Number(data.quantity) || 0,
          category: data.category || 'Uncategorized',
          description: data.description || 'No description available',
          sellerId: data.userId || 'unknown',
          sku: data.sku || '',
          companyName: data.companyName || 'Unknown Company'
        };
      });
      
      console.log('Processed products data:', productsData.length);
      setProducts(productsData);
      
      if (productsData.length === 0) {
        toast.info('No products found in the database');
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, quantity = 1) => {
    if (!currentUser) {
      toast.error('Please login to add to cart');
      return;
    }

    if (quantity > (product.quantity || 0)) {
      toast.error('Not enough stock available');
      return;
    }

    if (quantity < 1) {
      toast.error('Invalid quantity');
      return;
    }

    try {
      const cartData = {
        userId: currentUser.uid,
        productId: product.id,
        productName: product.name || 'Unknown Product',
        productImage: product.imageUrl || '',
        productSku: product.sku || '',
        sellerId: product.userId || product.sellerId || 'unknown',
        sellerCompany: product.companyName || 'Unknown Company',
        quantity: Number(quantity),
        unitPrice: Number(product.price) || 0,
        totalPrice: Number(product.price) * Number(quantity) || 0,
        addedAt: serverTimestamp()
      };

      console.log('Adding to cart:', cartData);
      await addDoc(collection(db, 'cart'), cartData);
      toast.success(`Added ${quantity} item(s) to cart successfully!`);
      
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add to cart. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
          <button 
            onClick={fetchProducts}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">


        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          {/* Enhanced Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search for products by name, description, or category..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg placeholder-gray-500"
              />
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="name">Name (A-Z)</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="stock">Stock Available</option>
              </select>
            </div>

            {/* Results Count */}
            <div className="flex items-end">
              <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg w-full">
                <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> products found
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Package className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Products Available</h2>
            <p className="text-gray-500 mb-6">There are currently no products in the database. Please check back later.</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Search className="w-16 h-16 text-gray-400" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No Products Found</h2>
            <p className="text-gray-500 mb-6">No products match your current search criteria.</p>
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Replace the ProductCard component with this updated version:

const ProductCard = ({ product, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    const maxStock = product.quantity || 0;
    setQuantity(Math.max(1, Math.min(maxStock, value)));
  };

  const incrementQuantity = () => {
    const maxStock = product.quantity || 0;
    if (quantity < maxStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      await onAddToCart(product, quantity);
    } finally {

      //set quantity back to 1 after adding to cart
      setQuantity(1);
      setIsAdding(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const handleImageLoad = () => {
    if (product.imageUrl && !imageError) {
      setImageLoaded(true);
    }
  };

  // Determine what to show
  const hasValidImage = product.imageUrl && !imageError;
  const shouldShowPlaceholder = !product.imageUrl || imageError;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col h-full">
      {/* Product Image */}
      <div className="relative w-full h-48 bg-gray-100">
        {/* Show loading indicator only for real images */}
        {hasValidImage && !imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="animate-pulse text-gray-400">Loading...</div>
          </div>
        )}

        {/* Show placeholder immediately if no image URL */}
        {shouldShowPlaceholder ? (
          <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
            <div className="text-gray-400 text-center">
              <div className="flex justify-center mb-2">
                <Camera className="w-10 h-10" />
              </div>
              <div className="text-sm">No Image</div>
            </div>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-48 object-cover transition-opacity duration-200 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
      </div>

      {/* Product Info - Flex grow to push quantity to bottom */}
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name || 'Unnamed Product'}
        </h3>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {product.description || 'No description available'}
        </p>

        <div className="mb-3 flex flex-wrap gap-2">
          <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
            {product.category || 'Uncategorized'}
          </span>
          {product.sku && (
            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
              SKU: {product.sku}
            </span>
          )}
        </div>

        <div className="mb-2">
          <span className="text-xs text-gray-500">
            by {product.companyName || 'Unknown Company'}
          </span>
        </div>

        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-blue-600">
            ${(product.price || 0).toFixed(2)}
          </span>
          <span className={`text-sm ${(product.quantity || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            Stock: {product.quantity || 0}
          </span>
        </div>

        {/* Spacer to push quantity section to bottom */}
        <div className="flex-grow"></div>

        {/* Quantity Selector - Always at bottom */}
        <div className="mt-auto">
          {(product.quantity || 0) > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-2">
                <button
                  onClick={decrementQuantity}
                  disabled={quantity <= 1}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  -
                </button>
                
                <input
                  type="number"
                  min="1"
                  max={product.quantity || 1}
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="w-16 text-center px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                
                <button
                  onClick={incrementQuantity}
                  disabled={quantity >= (product.quantity || 0)}
                  className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  +
                </button>
              </div>
              
              <div className="mt-2 text-sm text-gray-600">
                Total: <span className="font-semibold">${((product.price || 0) * quantity).toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Add to Cart Button - Always at bottom */}
          <button
            onClick={handleAddToCart}
            disabled={(product.quantity || 0) === 0 || isAdding}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Adding...' : (product.quantity || 0) === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
          </button>
        </div>
      </div>
    </div>
  );
};


export default Order;