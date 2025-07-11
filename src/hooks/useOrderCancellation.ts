import { useState, useCallback } from 'react'
import { notification } from 'antd'
import { useCancelOrder } from './useCancelOrder'
import { usePendingCancelOrders } from './usePendingCancelOrders'
import socket from '../socket'

export const useOrderCancellation = (onCancelSuccess?: () => void) => {
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const { mutate: cancelOrder } = useCancelOrder()
  const { saveCancelOrderLocally } = usePendingCancelOrders(onCancelSuccess)

  const handleCancelOrder = useCallback((orderId: string) => {
    setCancelOrderId(orderId)
  }, [])

  const confirmCancelOrder = useCallback(() => {
    if (!cancelOrderId) return

    if (!socket.connected) {
      saveCancelOrderLocally(cancelOrderId)
      setCancelOrderId(null)
      return
    }

    cancelOrder(cancelOrderId, {
      onSuccess: () => {
        notification.success({
          message: `Order ${cancelOrderId} cancelled successfully`,
        })
        setCancelOrderId(null)
        onCancelSuccess?.()
      },
      onError: () => {
        notification.error({
          message: 'Failed to cancel order. Please try again.',
        })
        setCancelOrderId(null)
      },
    })
  }, [cancelOrderId, cancelOrder, saveCancelOrderLocally, onCancelSuccess])

  const cancelCancelOrder = useCallback(() => {
    setCancelOrderId(null)
  }, [])

  return {
    cancelOrderId,
    handleCancelOrder,
    confirmCancelOrder,
    cancelCancelOrder,
  }
}
