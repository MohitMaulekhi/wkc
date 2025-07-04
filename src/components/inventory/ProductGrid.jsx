import ProductCard from './ProductCard';

const ProductGrid = ({ products, onEdit, onDelete }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {products.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    ))}
  </div>
);

export default ProductGrid; 