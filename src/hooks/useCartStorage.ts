import { useState, useEffect } from 'react'
import { CartItem } from 'src/types/product'
import { CartStorage } from 'src/utils/cartStorage'

export const useCartStorage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCartItems = () => {
      const items = CartStorage.getCartItems()
      setCartItems(items)
      setLoading(false)
    }

    loadCartItems()
  }, [])

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prevItems) => {
      const updatedItems =
        quantity === 0
          ? prevItems.filter((item) => item.productId !== productId)
          : prevItems.map((item) => (item.productId === productId ? { ...item, quantity } : item))

      CartStorage.saveCartItems(updatedItems)
      return updatedItems
    })
  }
  const removeItem = (productId: string) => {
    setCartItems((prevItems) => {
      const updatedItems = prevItems.filter((item) => item.productId !== productId)
      CartStorage.saveCartItems(updatedItems)
      return updatedItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    CartStorage.clearCart()
  }

  return {
    cartItems,
    loading,
    updateQuantity,
    removeItem,
    clearCart,
  }
}
