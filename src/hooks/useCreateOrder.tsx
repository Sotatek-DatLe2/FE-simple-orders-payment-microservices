import { useMutation, useQueryClient } from '@tanstack/react-query'
import ordersService from 'src/service/Home'

export const useCreateOrder = ({
  onSuccessCallback,
  onErrorCallback,
}: {
  onSuccessCallback?: (orderId: string) => void
  onErrorCallback?: () => void
}) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (order: { userId: string; totalAmount: number }) => ordersService.createOrder(order),
    onSuccess: (response) => {
      console.log('Order created successfully:', response.data)
      const orderId = response.data?.data.orderId
      queryClient.invalidateQueries({ queryKey: ['orders'] })
      onSuccessCallback?.(orderId)
    },
    onError: () => {
      console.error('Failed to create order')
      onErrorCallback?.()
    },
  })
}
