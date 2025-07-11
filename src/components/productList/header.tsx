import React from 'react'
import { ShoppingCart, Search, User, Menu } from 'lucide-react'

export const Header: React.FC = () => {
  const cartItemsLocalStorage = localStorage.getItem('cartItems')
  const initialCartItemsCount = cartItemsLocalStorage ? JSON.parse(cartItemsLocalStorage).length : 0
  const cartItems = initialCartItemsCount

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-gray-900">StoreHub</h1>
            </div>
            <nav className="hidden md:ml-10 md:flex md:space-x-8">
              <a href="#" className="text-gray-900 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Home
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Products
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Categories
              </a>
              <a href="/" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Order Dashboard
              </a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-500 hover:text-blue-600">
              <User className="w-5 h-5" />
            </button>

            <button
              className="relative p-2 text-gray-500 hover:text-blue-600"
              onClick={() => (window.location.href = '/cart')}
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartItems}
                </span>
              )}
            </button>

            <button className="md:hidden p-2 text-gray-500 hover:text-blue-600">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
