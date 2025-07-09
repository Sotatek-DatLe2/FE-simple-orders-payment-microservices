import React from 'react';
import { Product } from '../../types/product';
import { ProductCard } from './productCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (productId: string) => void;
  getCartQuantity: (productId: string) => number;
}

export const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  onAddToCart, 
  getCartQuantity 
}) => {
  return (
    <div className="flex overflow-x-auto gap-6 pb-6 scrollbar-hide">
      {products.map((product) => (
        <ProductCard
          key={product.productId}
          product={product}
          onAddToCart={onAddToCart}
          cartQuantity={getCartQuantity(product.productId)}
        />
      ))}
    </div>
  );
};