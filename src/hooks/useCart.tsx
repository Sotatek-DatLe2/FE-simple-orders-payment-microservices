import { useState } from 'react';
import { CartItem } from '../types/product';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const getCartQuantity = (productId: string): number =>
    cartItems.find((item) => item.productId === productId)?.quantity || 0;

  const addToCart = (productId: string): void => {
    setCartItems((prev) => {
      const existingItem = prev.find((item) => item.productId === productId);
      return existingItem
        ? prev.map((item) => 
            item.productId === productId 
              ? { ...item, quantity: item.quantity + 1 } 
              : item
          )
        : [...prev, { productId, quantity: 1 }];
    });

    const existingCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = existingCartItems.find((item: CartItem) => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      existingCartItems.push({ productId, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
  };

  const updateQuantity = (productId: string, quantity: number): void => {
    setCartItems((prev) =>
      quantity === 0
        ? prev.filter((item) => item.productId !== productId)
        : prev.find((item) => item.productId === productId)
        ? prev.map((item) => 
            item.productId === productId 
              ? { ...item, quantity } 
              : item
          )
        : [...prev, { productId, quantity }]
    );
  };

  return {
    cartItems,
    getCartQuantity,
    addToCart,
    updateQuantity
  };
};