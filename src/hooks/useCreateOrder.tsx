// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import ordersService from 'src/service/Home'

// export const useCreateOrder = ({
//   onSuccessCallback,
//   onErrorCallback,
// }: {
//   onSuccessCallback?: (orderId: string) => void
//   onErrorCallback?: () => void
// }) => {
//   const queryClient = useQueryClient()

//   return useMutation({
//     mutationFn: (order: { userId: string; totalAmount: number }) => ordersService.createOrder(order),
//     onSuccess: (response) => {
//       console.log('Order created successfully:', response.data)
//       const orderId = response.data?.data.orderId
//       queryClient.invalidateQueries({ queryKey: ['orders'] })
//       onSuccessCallback?.(orderId)
//     },
//     onError: () => {
//       console.error('Failed to create order')
//       onErrorCallback?.()
//     },
//   })
// }

// import { useMutation, useQueryClient } from '@tanstack/react-query'
// import ordersService from 'src/service/Home'
// import { useSocketStatus } from './useSocketStatus'

// export const useCreateOrder = ({
//   onSuccessCallback,
//   onErrorCallback,
//   offlineFallback,
// }: {
//   onSuccessCallback?: (orderId: string) => void
//   onErrorCallback?: () => void
//   offlineFallback?: (order: { userId: string; totalAmount: number }) => void
// }) => {
//   const queryClient = useQueryClient()
//   const isConnected = useSocketStatus()

//   return useMutation({
//     mutationFn: async (order: { userId: string; totalAmount: number }) => {
//       if (!isConnected) {
//         console.warn('Socket disconnected, saving order offline...')
//         if (offlineFallback) {
//           offlineFallback(order)
//         }
//         throw new Error('Offline mode - Order saved locally')
//       }

//       return ordersService.createOrder(order)
//     },
//     onSuccess: (response) => {
//       console.log('Order created successfully:', response.data)
//       const orderId = response.data?.data.orderId
//       queryClient.invalidateQueries({ queryKey: ['orders'] })
//       onSuccessCallback?.(orderId)
//     },
//     onError: (error: any) => {
//       console.error('Failed to create order', error)
//       onErrorCallback?.()
//     },
//   })
// }

import { useMutation, useQueryClient } from '@tanstack/react-query'
import ordersService from 'src/service/Home'
import socket from 'src/socket'

export const useCreateOrder = ({
  onSuccessCallback,
  onErrorCallback,
  offlineFallback,
}: {
  onSuccessCallback?: (orderId: string) => void
  onErrorCallback?: () => void
  offlineFallback?: (order: { userId: string; totalAmount: number }) => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (order: { userId: string; totalAmount: number }) => {
      if (!socket.connected) {
        console.warn('Socket disconnected, saving order offline...')
        offlineFallback?.(order)
        throw new Error('Offline mode - Order saved locally')
      }

      return ordersService.createOrder(order)
    },
    onSuccess: (response) => {
      console.log('Order created successfully:', response.data)
      const orderId = response.data?.data.orderId
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
