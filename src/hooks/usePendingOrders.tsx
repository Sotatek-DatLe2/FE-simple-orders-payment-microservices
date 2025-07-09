import { useCallback } from "react"
import { pendingOrdersService } from "src/service/Home/pendingOrderService"
import { NewOrder } from "src/types"

export const usePendingOrders = () => {
  const resendPendingOrders = useCallback(() => {
    console.log('Resending pending orders...')
    const pending = pendingOrdersService.getPendingOrders()
    
    if (pending.length === 0) return

    pending.forEach((order: NewOrder) => {
      console.log('Resent pending order:', order)
    })

    pendingOrdersService.clearPendingOrders()
  }, [])

  return { resendPendingOrders }
}