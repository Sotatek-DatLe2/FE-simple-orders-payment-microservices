import React, { useState, useCallback } from 'react'
import { Layout, Modal, Form, notification, message } from 'antd'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import OrderTable from 'src/components/orderTables'
import CreateOrderForm from 'src/components/newOrderForm'
// import { onlineManager } from '@tanstack/react-query'
import { OrderFilter } from 'src/components/orderFilter'
import { useOrders } from 'src/hooks/useQuery'
import { useCreateOrder } from 'src/hooks/useCreateOrder'
import { NewOrder } from 'src/types'
import { useSocketStatus } from 'src/hooks/useSocketStatus'

const { Content } = Layout

const mockProducts = [
  { productId: 'prod1', name: 'Laptop', price: 999.99 },
  { productId: 'prod2', name: 'Smartphone', price: 499.99 },
  { productId: 'prod3', name: 'Headphones', price: 79.99 },
  { productId: 'prod4', name: 'Mouse', price: 29.99 },
]

const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [showNewOrderModal, setShowNewOrderModal] = useState(false)
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({
    status: '',
    startDate: '',
    endDate: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'DESC',
  })
  const [form] = Form.useForm()
  const [newOrder, setNewOrder] = useState<NewOrder>({ userId: '1', items: [], totalAmount: 0 })
  const { data, isLoading, refetch } = useOrders(filters, page)
  const { mutate: createOrder, isPending: creating } = useCreateOrder({
    onSuccessCallback: (orderId) => {
      notification.success({
        message: `Order ${orderId} created successfully`,
        description: 'The order has been saved in the system.',
      })
      setShowNewOrderModal(false)
      form.resetFields()
    },
    onErrorCallback: () => {
      notification.error({
        message: 'Failed to create order due to payment failed.',
        description: 'The order was not completed.',
      })
      setShowNewOrderModal(false)
      form.resetFields()
    },
  })

  const resendPendingOrders = () => {
    console.log('Resending pending orders...')
    const pending = JSON.parse(localStorage.getItem('PENDING_ORDERS') || '[]')
    if (pending.length === 0) return
    pending.forEach((order: { userId: string; totalAmount: number }) => {
      createOrder(order, {
        onSettled: () => {
          console.log('Resent pending order:', order)
        },
      })
    })

    localStorage.removeItem('PENDING_ORDERS')
  }

  const isConnected = useSocketStatus({ onReconnect: resendPendingOrders })
  const totalPages = data?.totalPages || 1
  const orders = data?.orders || []

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }

  const handleDateFilter = (dates: [any, any] | null) => {
    const isValid = dates && dates[0]?.isValid() && dates[1]?.isValid()
    handleFilterChange({
      startDate: isValid ? dates[0]?.format('YYYY-MM-DD') : '',
      endDate: isValid ? dates[1]?.format('YYYY-MM-DD') : '',
    })
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage)
  }

  const calculateTotalAmount = useCallback(() => {
    const items = form.getFieldValue('items') || []

    const total = items.reduce((sum: number, item: { productId?: string; quantity?: number } = {}) => {
      if (!item || !item.productId) return sum

      const product = mockProducts.find((p) => p.productId === item.productId)
      return sum + (product ? product.price * (item.quantity || 0) : 0)
    }, 0)

    form.setFieldsValue({ totalAmount: total })
    setNewOrder((prev) => ({ ...prev, totalAmount: total }))
  }, [form])

  const handleCreateOrder = () => {
    const orderData = { userId: newOrder.userId, totalAmount: newOrder.totalAmount }

    if (!isConnected) {
      const pending = JSON.parse(localStorage.getItem('PENDING_ORDERS') || '[]')
      pending.push(orderData)
      localStorage.setItem('PENDING_ORDERS', JSON.stringify(pending))
      notification.info({
        message: 'Order saved locally',
        description: 'Your order will be sent when connection is restored.',
      })
      setShowNewOrderModal(false)
      form.resetFields()
      return
    }

    createOrder(orderData, {
      onSettled: () => refetch(),
    })
  }

  return (
    <Layout className="flex flex-row h-screen overflow-hidden">
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Layout className="flex flex-col flex-1">
        <HeaderComp />
        <Content className="flex-1 overflow-y-auto bg-gray-100 p-6 gap-4">
          <div className="flex justify-between items-center mb-4">
            <button
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              onClick={() => setShowNewOrderModal(true)}
            >
              + Create Order
            </button>
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
              <span>{isConnected ? 'Online' : 'Offline'}</span>
            </div>
          </div>

          <OrderFilter
            onSearch={(search) => handleFilterChange({ search })}
            onStatusFilter={(status) => handleFilterChange({ status })}
            onDateFilter={handleDateFilter}
            onSortChange={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
          />

          <OrderTable orders={orders} loading={isLoading} refresh={false} setRefresh={() => refetch()} />

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

      <Modal
        title="Create New Order"
        open={showNewOrderModal}
        onCancel={() => setShowNewOrderModal(false)}
        footer={null}
      >
        <CreateOrderForm
          onCancel={() => setShowNewOrderModal(false)}
          form={form}
          calculateTotalAmount={calculateTotalAmount}
          handleCreateOrder={handleCreateOrder}
          creating={creating}
        />
      </Modal>
    </Layout>
  )
}

export default Home
