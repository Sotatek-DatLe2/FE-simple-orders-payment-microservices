import { useCallback } from 'react'
import { notification } from 'antd'
import { useCancelOrder } from './useCancelOrder'
import { localStorageUtils } from 'src/utils/localStorageService'
import socket from '../socket'

export const usePendingCancelOrders = (onCancelSuccess?: () => void) => {
  const { mutate: cancelOrder } = useCancelOrder()

  const resendPendingCancellations = useCallback(() => {
    const pending = localStorageUtils.getPendingCancelOrders()
    if (pending.length === 0) return

    console.log('Resending pending cancel request...')
    pending.forEach((orderId: string) => {
      if (socket.connected) {
        cancelOrder(orderId, {
          onSuccess: () => {
            console.log(`Resent cancel for order ${orderId}`)
            notification.success({ 
              message: `Order ${orderId} cancelled successfully (resend)` 
            })
            onCancelSuccess?.()
          },
          onError: () => {
            console.error(`Failed to resend cancel for order ${orderId}`)
          },
        })
      }
    })
    localStorageUtils.removePendingCancelOrders()
  }, [cancelOrder, onCancelSuccess])

  const saveCancelOrderLocally = useCallback((orderId: string) => {
    localStorageUtils.savePendingCancelOrder(orderId)
    notification.info({
      message: `Order ${orderId} cancel saved locally`,
      description: 'Will cancel when connection is restored.',
    })
  }, [])

  return {
    resendPendingCancellations,
    saveCancelOrderLocally,
  }
}
