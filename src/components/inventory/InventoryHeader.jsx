import { Search, Star } from "lucide-react";

const InventoryHeader = ({ currentUser, products, onAddProduct, searchValue, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {currentUser?.userType === "walmart" ? "Walmart" : "Seller"} Inventory
        </h1>
        <p className="text-gray-600 text-lg">
          Welcome back, {currentUser?.firstName} {currentUser?.lastName}
        </p>
        <div className="flex items-center space-x-4 mt-2">
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>{products.length} products in inventory</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{products.filter(p => p.quantity < 10).length} low stock items</span>
          </div>
        </div>
      </div>
      <div className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchValue}
            onChange={e => onSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[220px]"
          />
        </div>
        <button
          onClick={onAddProduct}
          className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          <span>Add Product</span>
        </button>
      </div>
    </div>
  );
};

export default InventoryHeader; 