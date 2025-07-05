import ProductCard from './ProductCard';

const ProductGrid = ({ products, onEdit, onDelete }) => {
  // Find the lowest price product for each SKU
  const skuToLowestPriceId = {};
  products.forEach((product) => {
    if (
      !skuToLowestPriceId[product.sku] ||
      product.price < products.find(p => p.id === skuToLowestPriceId[product.sku]).price
    ) {
      skuToLowestPriceId[product.sku] = product.id;
    }
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEdit}
          onDelete={onDelete}
          isRecommended={skuToLowestPriceId[product.sku] === product.id}
        />
      ))}
    </div>
  );
};

export default ProductGrid; 