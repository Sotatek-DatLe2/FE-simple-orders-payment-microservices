import { notification } from "antd"
import { useCallback } from "react"
import { pendingOrdersService } from "src/service/Home/pendingOrderService"
import { NewOrder } from "src/types"
import { useCreateOrder } from "./useCreateOrder"

export const usePendingOrders = () => {
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
  const resendPendingOrders = useCallback(() => {
    console.log('Resending pending orders...')
    const pending = pendingOrdersService.getPendingOrders()
    
    if (pending.length === 0) return

    pending.forEach((order: NewOrder) => {
      createOrder(order)
    })

    pendingOrdersService.clearPendingOrders()
  }, [])

  return { resendPendingOrders }
}