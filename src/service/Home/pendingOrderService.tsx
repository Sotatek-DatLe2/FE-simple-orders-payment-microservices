import { NewOrder, PendingOrdersService } from "src/types"
import { STORAGE_KEYS } from "src/const/constants"

export const pendingOrdersService: PendingOrdersService = {
  getPendingOrders: () => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PENDING_ORDERS) || '[]')
    } catch (error) {
      console.error('Error parsing pending orders:', error)
      return []
    }
  },

  savePendingOrder: (order: NewOrder) => {
    try {
      const pending = pendingOrdersService.getPendingOrders()
      pending.push(order)
      localStorage.setItem(STORAGE_KEYS.PENDING_ORDERS, JSON.stringify(pending))
    } catch (error) {
      console.error('Error saving pending order:', error)
    }
  },

  clearPendingOrders: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.PENDING_ORDERS)
    } catch (error) {
      console.error('Error clearing pending orders:', error)
    }
  },
}