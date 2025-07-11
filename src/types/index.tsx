import moment from 'moment'
import { Dayjs } from 'dayjs'

export interface ListOrders {
  id: string // Server-generated ID
  customerName: string
  items: { productId: string; quantity: number }[]
  totalAmount: number
  createdAt: string
  updatedAt: string
  status: string
  localId?: string // Optional for local orders before sync
}

export interface OrderHistory {
  status: string
  id: string
  orderId: string
  previousState: string | null
  createdAt: string
}

export interface PaymentDetails {
  cardNumber: string
  expirationDate: string
  cvv: string
}

export interface OrderDisplayTableProps {
  orders: Order[]
  loading: boolean
  onCancelSuccess?: () => void
}

export interface NewOrder {
  customerName: string
  totalAmount: number
  paymentDetails: PaymentDetails
  items: { productId: string; quantity: number }[]
  localId?: string // Optional for local orders before sync
}

export interface OrderDetailResponse {
  data: {
    order: Order
    history: OrderHistory[]
  }
}

export interface Order {
  id: string
  customerName: string
  createdAt: string
  status: string
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

export interface OrderFilters {
  status: string
  startDate: string
  endDate: string
  search: string
  sortBy: string
  sortOrder: string
}

export interface PendingOrdersService {
  getPendingOrders: () => NewOrder[]
  savePendingOrder: (order: NewOrder) => void
  clearPendingOrders: () => void
}

export interface OrderFormProps {
  onCancel: () => void
  handleCreateOrder: () => void
  form: any
  calculateTotalAmount: (changedValues: any, allValues: any) => void
  creating: boolean
}
