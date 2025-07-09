
import React from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Product } from '../../types/product';

interface CartItemProps {
  product: Product;
  quantity: number;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
}

export const CartItemComponent: React.FC<CartItemProps> = ({
  product,
  quantity,
  onUpdateQuantity,
  onRemoveItem
}) => {
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 0) {
      onUpdateQuantity(product.productId, newQuantity);
    }
  };

  const subtotal = product.price * quantity;

  return (
    <div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-sm border">
      <div className="flex-shrink-0">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-20 h-20 object-contain rounded-lg bg-gray-100"
        />
      </div>
      
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
        <p className="text-gray-600 text-sm mb-2">Category: {product.category}</p>
        <p className="text-xl font-bold text-blue-600">${product.price}</p>
        
        {product.colors && product.colors.length > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-gray-500">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 3).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Minus className="w-4 h-4" />
          </button>
          
          <span className="w-12 text-center font-medium">{quantity}</span>
          
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        
        <div className="text-right">
          <p className="text-lg font-bold text-gray-900">${subtotal.toFixed(2)}</p>
        </div>
        
        <button
          onClick={() => onRemoveItem(product.productId)}
          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};