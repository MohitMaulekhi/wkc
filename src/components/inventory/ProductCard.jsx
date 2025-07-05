import { Edit, Trash2, Eye, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onEdit, onDelete }) => (
  <Link to={`/product/${product.id}`}>
    <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          {/* Only SKU right */}
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">#{product.sku}</span>
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
        <p className="text-gray-900 font-medium mb-2 line-clamp-2">{product.description}</p>
        <div className="space-y-3 mb-6">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Price:</span>
            <span className="text-2xl font-bold text-green-600">${product.price}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">Quantity:</span>
            <span className="text-lg font-bold text-gray-900">{product.quantity}</span>
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
        <Link
          to={`/product/${product.id}`}
          className="w-full bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium flex items-center justify-center"
        >
          View Details
        </Link>
      </div>
    </div>
  </Link>
);

export default ProductCard; 