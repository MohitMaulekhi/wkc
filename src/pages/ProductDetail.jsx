import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebase";
import { useAuth } from "../context/UseAuth";
import toast from "react-hot-toast";
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Package, 
  DollarSign, 
  Hash, 
  Calendar, 
  Tag, 
  User, 
  Building,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp
} from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    if (!id) return;
    
    setLoading(true);
    try {
      const productDoc = await getDoc(doc(db, "products", id));
      
      if (productDoc.exists()) {
        const productData = {
          id: productDoc.id,
          ...productDoc.data()
        };
        setProduct(productData);
      } else {
        setError("Product not found");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product");
      toast.error("Failed to load product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    
    try {
      await deleteDoc(doc(db, "products", id));
      toast.success("Product deleted successfully!");
      navigate("/inventory");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const handleEdit = () => {
    navigate(`/inventory?edit=${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600 mb-4">{error || "The product you're looking for doesn't exist."}</p>
          <Link 
            to="/inventory"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/inventory"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Inventory
          </Link>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600">Product Details</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleEdit}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Product Information</h2>
                <Link 
                  to={`/category/${encodeURIComponent(product.category)}`}
                  className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
                >
                  <Tag className="w-4 h-4 mr-1" />
                  {product.category}
                </Link>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{product.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      <Hash className="w-4 h-4 text-gray-500 mr-2" />
                      <span className="text-gray-900 font-mono">#{product.sku}</span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      <DollarSign className="w-4 h-4 text-green-600 mr-2" />
                      <span className="text-gray-900 font-bold text-lg">${product.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity in Stock</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      <Package className="w-4 h-4 text-blue-600 mr-2" />
                      <span className={`font-bold text-lg ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                        {product.quantity}
                      </span>
                      {product.quantity < 10 && (
                        <span className="ml-2 text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Low Stock</span>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Status</label>
                    <div className="flex items-center bg-gray-50 rounded-lg p-3">
                      {product.quantity > 0 ? (
                        <>
                          <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                          <span className="text-green-600 font-medium">In Stock</span>
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                          <span className="text-red-600 font-medium">Out of Stock</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Created</label>
                  <div className="flex items-center bg-gray-50 rounded-lg p-3">
                    <Calendar className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-900">
                      {product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                  <div className="flex items-center bg-gray-50 rounded-lg p-3">
                    <Clock className="w-4 h-4 text-gray-500 mr-2" />
                    <span className="text-gray-900">
                      {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Seller Info */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Seller Information</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <User className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {currentUser?.firstName} {currentUser?.lastName}
                  </span>
                </div>
                <div className="flex items-center">
                  <Building className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {currentUser?.companyName || 'Independent Seller'}
                  </span>
                </div>
                <div className="flex items-center">
                  <Tag className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="text-sm text-gray-600 capitalize">
                    {currentUser?.userType || 'Seller'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="text-lg font-bold text-green-600">
                    ${(product.price * product.quantity).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Stock Level</span>
                  <span className={`text-sm font-medium ${product.quantity < 10 ? 'text-red-600' : 'text-green-600'}`}>
                    {product.quantity < 10 ? 'Low' : 'Good'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status</span>
                  <span className={`text-sm font-medium ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {product.quantity > 0 ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail; 