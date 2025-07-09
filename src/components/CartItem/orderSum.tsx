// components/OrderSummary/OrderSummary.tsx
import React from 'react';
import { Product } from '../../types/product';
import { CartItem } from 'src/types/product';

interface OrderSummaryProps {
  cartItems: CartItem[];
  products: Product[];
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, products }) => {
  const getProductById = (id: string) => products.find(p => p.productId === id);
  
  const subtotal = cartItems.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product ? product.price * item.quantity : 0);
  }, 0);

  const tax = subtotal * 0.08; // 8% tax
  const shipping = subtotal > 100 ? 0 : 9.99; // Free shipping over $100
  const total = subtotal + tax + shipping;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="font-medium">
            {shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        
        <div className="border-t pt-2">
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      
      {shipping > 0 && (
        <p className="text-sm text-gray-500 mt-3">
          Add ${(100 - subtotal).toFixed(2)} more for free shipping
        </p>
      )}
    </div>
  );
};