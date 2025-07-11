import { useMutation, useQueryClient } from '@tanstack/react-query'
import ordersService from 'src/service/Home'

export const useCancelOrder = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (orderId: string) => ordersService.cancelOrder(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] })
    },
  })
}
