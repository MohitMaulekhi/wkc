import { Eye, Image } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/UseAuth";

const ProductCard = ({ product }) => {
  const { currentUser } = useAuth();
  const userType = currentUser?.userType || 'seller';
  
  return (
    <Link to={`/${userType}/product/${product.id}`}>
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {product.imageUrl ? (
          <img 
            src={product.imageUrl} 
            alt={product.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
        ) : null}
        <div 
          className={`w-full h-full flex items-center justify-center ${product.imageUrl ? 'hidden' : 'flex'}`}
          style={{ display: product.imageUrl ? 'none' : 'flex' }}
        >
          <div className="text-center">
            <Image className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No Image</p>
          </div>
        </div>
        {/* SKU Badge */}
        <div className="absolute top-3 right-3">
          <span className="text-xs text-white bg-black bg-opacity-50 px-2 py-1 rounded-full backdrop-blur-sm">
            SKU - {product.sku}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Quantity:</span>
            <span className={`text-lg font-bold ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {product.quantity}
            </span>
          </div>
        </div>
        <div className="border-t border-gray-100 pt-4 mb-4">
          <div className="flex items-center text-sm font-semibold">
            <Eye className="w-4 h-4 text-gray-500 mr-2" />
            <span className="text-gray-700">{product.userType === "walmart" ? "Walmart" : "Independent Seller"}</span>
          </div>
          {product.companyName && (
            <div className="flex items-center text-sm mt-1">
              <span className="text-gray-600">{product.companyName}</span>
            </div>
          )}
        </div>
        <div className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium flex items-center justify-center">
          View Details
        </div>
      </div>
    </div>
  </Link>
  );
};

export default ProductCard; 