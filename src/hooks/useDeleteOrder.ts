import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notification } from 'antd'
import ordersService from 'src/service/Home'

interface DeleteOrderResponse {
  success: boolean
  message?: string
}

interface DeleteOrderError {
  message: string
  status?: number
}

export const useDeleteOrder = () => {
  const queryClient = useQueryClient()

  return useMutation<DeleteOrderResponse, DeleteOrderError, string>({
    mutationFn: async (orderId: string) => {
      try {
        const response = await ordersService.deleteOrder(orderId)
        
        // Check if the response indicates success
        if (response.status < 200 || response.status >= 300) {
          throw new Error(response.data?.message || 'Failed to delete order')
        }
        
        return {
          success: true,
          message: response.data?.message || 'Order deleted successfully'
        }
      } catch (error: any) {
        throw {
          message: error.response?.data?.message || error.message || 'Failed to delete order',
          status: error.response?.status
        }
      }
    },
    onSuccess: (data, orderId) => {
      // Show success notification
      notification.success({
        message: `Order ${orderId} deleted successfully`,
        description: data.message,
      })
      
      // Invalidate and refetch orders list
      queryClient.invalidateQueries({
        queryKey: ['orders']
      })
      
      // Remove the specific order from cache
      queryClient.removeQueries({
        queryKey: ['orders', orderId]
      })
    },
    onError: (error, orderId) => {
      // Show error notification
      notification.error({
        message: `Failed to delete order ${orderId}`,
        description: error.message || 'An error occurred while deleting the order.',
      })
    },
  })
}
