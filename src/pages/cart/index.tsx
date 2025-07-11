import React, { useState } from 'react'
import { ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react'
import { useCartStorage } from 'src/hooks/useCartStorage'
import { NewOrder, PaymentDetails } from 'src/types/index'
import { MOCK_PRODUCTS } from '../../utils/dummy'
import { CartItemComponent } from 'src/components/CartItem/index'
import { PaymentForm } from 'src/components/PaymentForm/index'
import { OrderSummary } from 'src/components/CartItem/orderSum'
import { Header } from 'src/components/productList/header'
import { useCreateOrder } from 'src/hooks/useCreateOrder'
import { notification } from 'antd'
import { CartStorage } from 'src/utils/cartStorage'
import { Dispatch } from 'redux'
import { showLoading, hideLoading } from 'src/stores/loading.store'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export const CartDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { cartItems, loading, updateQuantity, removeItem, clearCart } = useCartStorage()
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({
    cardNumber: '',
    expirationDate: '',
    cvv: '',
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const dispatch: Dispatch<any> = useDispatch()
  const { mutate: createOrder, isPending: creating } = useCreateOrder({
    onSuccessCallback: (id) => {
      notification.success({
        message: `Order ${id} created successfully`,
        description: 'The order has been saved in the system.',
      })
    },
    onErrorCallback: () => {
      notification.error({
        message: 'Failed to create order due to payment failed.',
        description: 'The order was not completed.',
      })
    },
  })

  const getProductById = (id: string) => MOCK_PRODUCTS.find((p) => p.productId === id)

  const handleCheckout = async () => {
    dispatch(showLoading())
    setIsProcessing(true)

    const orderRequest: NewOrder = {
      customerName: 'Guest',
      totalAmount: cartItems.reduce((total, item) => {
        const product = getProductById(item.productId)
        return total + (product ? product.price * item.quantity : 0)
      }, 0),
      paymentDetails,
      items: cartItems.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    }

    createOrder(orderRequest, {
      onSuccess: (id) => {
        CartStorage.clearCart()
        navigate('/', {
          state: {
            notification: {
              type: 'success',
              message: `Order ${id} created successfully`,
              description: 'Your order has been placed.',
            },
          },
        })
      },
      onError: () => {
        notification.error({
          message: 'Failed to create order',
          description: 'There was an issue processing your order. Please try again.',
        })
      },
    })

    dispatch(hideLoading())
    setIsProcessing(false)
  }

  const isFormValid = () => {
    return (
      paymentDetails.cardNumber.length >= 13 &&
      paymentDetails.expirationDate.length === 5 &&
      paymentDetails.cvv.length >= 3
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your cart...</p>
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started</p>
            <button
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              onClick={() => (window.location.href = '/products')}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <button
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
            onClick={() => (window.location.href = '/products')}
          >
            <ArrowLeft className="w-4 h-4" />
            Continue Shopping
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600">{cartItems.length} items in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const product = getProductById(item.productId)
              if (!product) return null

              return (
                <CartItemComponent
                  key={item.productId}
                  product={product}
                  quantity={item.quantity}
                  onUpdateQuantity={updateQuantity}
                  onRemoveItem={removeItem}
                />
              )
            })}
          </div>

          <div className="space-y-6">
            <OrderSummary cartItems={cartItems} products={MOCK_PRODUCTS} />

            <PaymentForm paymentDetails={paymentDetails} onPaymentDetailsChange={setPaymentDetails} />

            <button
              onClick={handleCheckout}
              disabled={!isFormValid() || isProcessing}
              className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Place Order
                </>
              )}
            </button>

            <button
              onClick={clearCart}
              className="w-full border border-red-300 text-red-600 py-3 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartDetailPage
