import { Edit, Trash2, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const ProductCard = ({ product, onEdit, onDelete }) => (
  <Link to={`/product/${product.id}`}>
  <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300">
    <div className="p-6">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-gray-900 truncate flex-1 mr-2">{product.name}</h3>
        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">#{product.sku}</span>
      </div>
      <div className="mb-3">
        <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
          {product.category}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Price:</span>
          <span className="text-lg font-bold text-green-600">${product.price}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-500">Quantity:</span>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-bold ${product.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
              {product.quantity}
            </span>
            {product.quantity < 10 && (
              <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full">Low Stock</span>
            )}
          </div>
        </div>
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onEdit(product)}
          className="flex-1 bg-gray-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors font-medium flex items-center justify-center"
        >
          <Edit className="w-4 h-4 mr-1" />
          Edit
        </button>
        <button
          onClick={() => onDelete(product.id)}
          className="flex-1 bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors font-medium flex items-center justify-center"
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Delete
        </button>
      </div>
      </div>
    </div>
  </Link>
);

export default ProductCard; 