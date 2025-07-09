import { CartItem } from "src/types/product";

export const CartStorage = {
  getCartItems: (): CartItem[] => {
    try {
      const items = localStorage.getItem('cartItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Error reading cart from localStorage:', error);
      return [];
    }
  },

  saveCartItems: (items: CartItem[]): void => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  },

  clearCart: (): void => {
    try {
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error clearing cart from localStorage:', error);
    }
  }
};