import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import ordersService from 'src/service/Home'
import socket from 'src/socket'
import { NewOrder } from 'src/types'
import { notification } from 'antd'
import { calculateOrderTotal, createOrderData } from 'src/utils/calculateTotal'
import { pendingOrdersService } from 'src/service/Home/pendingOrderService'

export const useCreateOrder = ({
  onSuccessCallback,
  onErrorCallback,
  offlineFallback,
}: {
  onSuccessCallback?: (orderId: string) => void
  onErrorCallback?: () => void
  offlineFallback?: (order: NewOrder) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: NewOrder) => {
      if (!socket.connected) {
        console.warn('Socket disconnected, saving order offline...')
        offlineFallback?.(order)
        // Save the order locally
        throw new Error('Offline mode - Order saved locally')
      }

      return ordersService.createOrder(order)
    },
    onSuccess: (response) => {
      console.log('Order created successfully:', response.data)
      const orderId = response.data?.data.id
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onSuccessCallback?.(orderId)
    },
    onError: (error: any) => {
      if (error.message === 'Offline mode - Order saved locally') {
        console.log('Order saved locally, no server call attempted.')
      } else {
        console.error('Failed to create order', error)
      }
      onErrorCallback?.()
    },
  })
}

export const useOrderCreation = (form: any, isConnected: boolean, refetch: () => void) => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [newOrder, setNewOrder] = useState<NewOrder>({
    customerName: '',
    items: [],
    totalAmount: 0,
    paymentDetails: {
      cvv: '',
      cardNumber: '',
      expirationDate: '',
    },
  })

  const { mutate: createOrder, isPending: creating } = useCreateOrder({
    onSuccessCallback: (id) => {
      notification.success({
        message: `Order ${id} created successfully`,
        description: 'The order has been saved in the system.',
      })
      closeModal()
    },
    onErrorCallback: () => {
      notification.error({
        message: 'Failed to create order due to payment failed.',
        description: 'The order was not completed.',
      })
      closeModal()
    },
  })

  const closeModal = useCallback(() => {
    setShowNewOrderModal(false)
    form.resetFields()
  }, [form])

  const calculateTotalAmount = useCallback(() => {
    const items = form.getFieldValue('items') || []
    const total = calculateOrderTotal(items)

    form.setFieldsValue({ totalAmount: total })
    setNewOrder((prev) => ({ ...prev, totalAmount: total }))
  }, [form])

  const handleCreateOrder = useCallback(() => {
    const items = form.getFieldValue('items') || []
    const orderData = createOrderData(newOrder.totalAmount, items)

    if (!isConnected) {
      pendingOrdersService.savePendingOrder(orderData)
      notification.info({
        message: 'Order saved locally',
        description: 'Your order will be sent when connection is restored.',
      })
      closeModal()
      return
    }

    createOrder(orderData, {
      onSettled: () => refetch(),
    })
  }, [form, newOrder.totalAmount, isConnected, createOrder, refetch, closeModal])

  const openModal = useCallback(() => {
    setShowNewOrderModal(true)
  }, [])

  return {
    showNewOrderModal,
    creating,
    calculateTotalAmount,
    handleCreateOrder,
    openModal,
    closeModal,
  }
}
