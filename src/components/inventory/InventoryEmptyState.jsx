import { Package } from 'lucide-react';

const InventoryEmptyState = ({ onAddProduct }) => (
  <div className="text-center py-16">
    <div className="flex justify-center mb-6">
      <Package className="w-24 h-24 text-gray-300" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No products yet</h3>
    <p className="text-gray-600 text-lg mb-8">Get started by adding your first product to the inventory.</p>
    <button
      onClick={onAddProduct}
      className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-medium"
    >
      Add Your First Product
    </button>
  </div>
);

export default InventoryEmptyState; 