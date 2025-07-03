import { useQuery } from '@tanstack/react-query'
import ordersService from 'src/service/Home'

export const useOrders = (filters: any, page: number) => {
  return useQuery({
    queryKey: ['orders', filters, page],
    queryFn: async () => {
      const res = await ordersService.getOrders({
        page,
        status: filters.status,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
      })
      return res.data
    },
  })
}
