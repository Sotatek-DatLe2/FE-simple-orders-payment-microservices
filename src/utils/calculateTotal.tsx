import { NewOrder } from "src/types";
import { MOCK_CUSTOMER_DATA, MOCK_PRODUCTS } from "./dummy";

export const calculateOrderTotal = (items: Array<{ productId?: string; quantity?: number }> = []): number => {
  return items.reduce((sum: number, item: { productId?: string; quantity?: number } = {}) => {
    if (!item?.productId) return sum
    
    const product = MOCK_PRODUCTS.find(p => p.productId === item.productId)
    return sum + (product ? product.price * (item.quantity || 0) : 0)
  }, 0)
}

export const createOrderData = (totalAmount: number, items: any[]): NewOrder => ({
  ...MOCK_CUSTOMER_DATA,
  totalAmount,
  items,
  paymentDetails: {
    ...MOCK_CUSTOMER_DATA.paymentDetails,
    expirationDate: MOCK_CUSTOMER_DATA.paymentDetails.expirationDate,
  },
})