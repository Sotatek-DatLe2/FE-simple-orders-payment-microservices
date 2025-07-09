import { ShoppingCart } from "lucide-react"
import React from "react"
import { CartItem, Product } from "src/types/product"
import { formatPrice } from "src/utils/formatPrice"

export const CartSummary: React.FC<{
  cartItems: CartItem[]
  products: Product[]
}> = ({ cartItems, products }) => {
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => {
    const product = products.find((p) => p.productId === item.productId)
    return sum + (product?.price || 0) * item.quantity
  }, 0)

  if (totalItems === 0) return null

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingCart className="w-5 h-5 text-blue-600" />
          <span className="font-semibold text-gray-800">Cart ({totalItems} items)</span>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900">{formatPrice(totalPrice)}</div>
          <button className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg mt-2 transition-colors duration-200">
            Checkout
          </button>
        </div>
      </div>
    </div>
  )
}