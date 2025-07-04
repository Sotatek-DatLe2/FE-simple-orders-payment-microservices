import moment from 'moment'
import { Dayjs } from 'dayjs'

export interface NewOrder {
  userId: string
  items: { productId: string; quantity: number }[]
  totalAmount: number
  createdAt?: string
  updatedAt?: string
  status?: string
  localId?: string // Added for offline orders
}

export interface ListOrders {
  orderId: string // Server-generated ID
  userId: string
  items: { productId: string; quantity: number }[]
  totalAmount: number
  createdAt: string
  updatedAt: string
  status: string
  localId?: string // Optional for local orders before sync
}

export interface OrderHistory {
  id: string
  orderId: string
  state: string
  previousState: string | null
  createdAt: string
}

export interface NewOrder {
  userId: string
  totalAmount: number
  items: { productId: string; quantity: number }[]
}

export interface OrderDetailResponse {
  data: any
  message: string
  success: boolean
}

export interface Order {
  orderId: string
  userId: string
  createdAt: string
  state: string
  totalAmount: number
  updatedAt: string
  cancelledAt: string | null
  history: OrderHistory[]
}

export interface OrderFilter {
  search: string
  status: string
  dateRange: [moment.Moment | null, moment.Moment | null] | null
}

export interface OrderListResponse {
  data: ListOrders[]
  total: number
  page: number
  totalPages: number
}

export interface OrderTableProps {
  orders: ListOrders[]
  loading: boolean
  onCancelSuccess?: () => void
  refresh?: boolean
  setRefresh?: (refresh: boolean) => void
}

export interface OrderFilterProps {
  onSearch: (value: string) => void
  onStatusFilter: (value: string) => void
  onDateFilter: (dates: [Dayjs | null, Dayjs | null] | null) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
}

export interface CustomNotificationProps {
  message: string
  type: 'success' | 'error'
}
