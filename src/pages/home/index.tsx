import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Layout, Modal, Form } from 'antd'
import { Dayjs } from 'dayjs'
import { hideLoading, showLoading } from 'src/stores/loading.store'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import { ListOrders, NewOrder } from 'src/types'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import OrderTable from 'src/components/orderTables'
import CreateOrderForm from 'src/components/newOrderForm'
import CustomNotification from 'src/components/customNoti'
import { localStorageService, syncWithServer } from 'src/utils/localStorageService'
import { OrderFilter } from 'src/components/orderFilter'

const { Content } = Layout

const mockProducts = [
  { productId: 'prod1', name: 'Laptop', price: 999.99 },
  { productId: 'prod2', name: 'Smartphone', price: 499.99 },
  { productId: 'prod3', name: 'Headphones', price: 79.99 },
  { productId: 'prod4', name: 'Mouse', price: 29.99 },
]

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [orders, setOrders] = useState<ListOrders[]>(localStorageService.getOrders())
  const [showNewOrderModal, setShowNewOrderModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  const [refresh, setRefresh] = useState<boolean>(false)
  const [newOrder, setNewOrder] = useState<NewOrder>({ userId: '1', items: [], totalAmount: 0 })
  const [form] = Form.useForm()
  const [filters, setFilters] = useState<{
    status?: string
    startDate?: string
    endDate?: string
    search?: string
    sortBy?: string
    sortOrder?: string
  }>({
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)
  const [isOnline, setIsOnline] = useState(navigator.onLine)
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'error'>('idle')

  const fetchOrders = async (currentPage: number = 1) => {
    try {
      setLoading(true)
      dispatch(showLoading())
      const response: AxiosResponse<{
        data: ListOrders[]
        total: number
        page: number
        totalPages: number
      }> = await ordersService.getOrders({
        page: currentPage,
        status: filters.status || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'DESC',
      })
      setOrders(Array.isArray(response.data.data) ? response.data.data : [])
      setPage(response.data.page)
      setTotalPages(response.data.totalPages)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setOrders([])
      setTotalPages(1)
    } finally {
      setLoading(false)
      dispatch(hideLoading())
    }
  }

  const handleSearch = (value: string) => {
    setFilters((prev) => ({ ...prev, search: value || undefined }))
    setPage(1)
    fetchOrders(1)
  }

  const handleStatusFilter = (status: string) => {
    setFilters((prev) => ({ ...prev, status: status || undefined }))
    setPage(1)
    fetchOrders(1)
  }

  const handleDateFilter = (dates: [Dayjs | null, Dayjs | null] | null) => {
    if (dates && dates[0] && dates[1]) {
      setFilters((prev) => ({
        ...prev,
        startDate: dates[0] ? dates[0].format('YYYY-MM-DD') : undefined,
        endDate: dates[1] ? dates[1].format('YYYY-MM-DD') : undefined,
      }))
    } else {
      setFilters((prev) => ({ ...prev, startDate: undefined, endDate: undefined }))
    }
    setPage(1)
    fetchOrders(1)
  }

  const handleSortChange = (sortBy: string, sortOrder: string) => {
    setFilters((prev) => ({ ...prev, sortBy, sortOrder }))
    setPage(1)
    fetchOrders(1)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage)
      fetchOrders(newPage)
    }
  }

  const handleCreateOrder = async (values: Omit<NewOrder, 'userId' | 'items'>) => {
    try {
      setLoading(true)
      dispatch(showLoading())
      const order = { userId: newOrder.userId, totalAmount: newOrder.totalAmount }
      const response: AxiosResponse<any> = await ordersService.createOrder(order)
      if (response.data) {
        setNotification({ message: `Order ${response.data.order.orderId} created successfully`, type: 'success' })
        setTimeout(() => setNotification(null), 2000)
        setShowNewOrderModal(false)
        form.resetFields()
        setRefresh(!refresh)
        fetchOrders(page)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setNotification({ message: 'Failed to create order. Please try again.', type: 'error' })
      setTimeout(() => setNotification(null), 2000)
    } finally {
      setLoading(false)
      dispatch(hideLoading())
    }
  }

  const handleShowNewOrderModal = () => setShowNewOrderModal(true)
  const handleCancelModal = () => {
    setShowNewOrderModal(false)
    form.resetFields()
  }

  const calculateTotalAmount = () => {
    const items = form.getFieldValue('items') || []
    const total = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
      const product = mockProducts.find((p) => p.productId === item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
    form.setFieldsValue({ totalAmount: total })
    setNewOrder((prev) => ({ ...prev, totalAmount: total }))
  }

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      syncWithServer({ orders, setOrders, setSyncStatus, dispatch, page, filters })
    }
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [orders, setOrders, setSyncStatus, dispatch, page, filters])

  useEffect(() => {
    fetchOrders()
  }, [filters, refresh])

  return (
    <Layout className="flex flex-row h-screen overflow-hidden">
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Layout className="flex flex-col flex-1">
        <HeaderComp />
        <Content className="flex-1 overflow-y-auto bg-gray-100 p-6 gap-4">
          <div className="flex justify-between items-center mb-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={handleShowNewOrderModal}
            >
              + Create Order
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span>{isOnline ? 'Online' : 'Offline'}</span>
              <span>{syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'synced' ? 'Synced' : ''}</span>
            </div>
          </div>

          <OrderFilter
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onDateFilter={handleDateFilter}
            onSortChange={handleSortChange}
          />

          <OrderTable orders={orders} loading={loading} refresh={refresh} setRefresh={setRefresh} />

          <div className="flex justify-end items-center gap-2 my-4">
            <button
              onClick={() => handlePageChange(page - 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={page === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <span
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`px-3 py-2 rounded border cursor-pointer ${
                  pageNum === page ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-600 border-blue-600'
                }`}
              >
                {pageNum}
              </span>
            ))}
            <button
              onClick={() => handlePageChange(page + 1)}
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </Content>
      </Layout>

      <Modal title="Create New Order" open={showNewOrderModal} onCancel={handleCancelModal} footer={null}>
        <CreateOrderForm
          onCancel={handleCancelModal}
          form={form}
          calculateTotalAmount={calculateTotalAmount}
          handleCreateOrder={handleCreateOrder}
          handleCancelModal={handleCancelModal}
        />
      </Modal>

      {notification && <CustomNotification message={notification.message} type={notification.type} />}
    </Layout>
  )
}

export default Home
