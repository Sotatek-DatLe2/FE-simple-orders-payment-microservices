import { useQuery } from '@tanstack/react-query'
import { useCallback, useState } from 'react'
import ordersService from 'src/service/Home'
import { OrderFilters } from 'src/types'
import { DEFAULT_FILTERS } from 'src/const/constants'

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

export const useOrderFilters = () => {
  const [filters, setFilters] = useState<OrderFilters>(DEFAULT_FILTERS)
  const [page, setPage] = useState(1)

  const handleFilterChange = useCallback((newFilters: Partial<OrderFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }, [])

  const handleDateFilter = useCallback(
    (dates: [any, any] | null) => {
      const isValid = dates && dates[0]?.isValid() && dates[1]?.isValid()
      handleFilterChange({
        startDate: isValid ? dates[0]?.format('YYYY-MM-DD') : '',
        endDate: isValid ? dates[1]?.format('YYYY-MM-DD') : '',
      })
    },
    [handleFilterChange]
  )

  const handlePageChange = useCallback((newPage: number, totalPages: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
    }
  }, [])

  return {
    filters,
    page,
    handleFilterChange,
    handleDateFilter,
    handlePageChange,
  }
}