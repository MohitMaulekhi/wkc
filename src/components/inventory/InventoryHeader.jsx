const InventoryHeader = ({ currentUser, products, onAddProduct }) => {
  return (
    <div className="flex justify-between items-center mb-8">
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
  );
};

export default InventoryHeader; 