import React, { useState, useCallback, useMemo } from 'react'
import { Layout, Modal, Form, notification } from 'antd'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import OrderTable from 'src/components/orderTables'
import CreateOrderForm from 'src/components/newOrderForm'
import { OrderFilter } from 'src/components/orderFilter'
import { useOrders } from 'src/hooks/useQuery'
import { useSocketStatus } from 'src/hooks/useSocketStatus'
import { Pagination } from 'src/components/pagination'
import { ConnectionStatus, CreateOrderButton } from 'src/components/connectionStatus'
import { usePendingOrders } from 'src/hooks/usePendingOrders'
import { useOrderCreation } from 'src/hooks/useCreateOrder'
import { useOrderFilters } from 'src/hooks/useQuery'
const { Content } = Layout

// Main component
const Home: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [form] = Form.useForm()

  const { filters, page, handleFilterChange, handleDateFilter, handlePageChange } = useOrderFilters()
  const { data, isLoading, refetch } = useOrders(filters, page)
  const { resendPendingOrders } = usePendingOrders()
  const isConnected = useSocketStatus({ onReconnect: resendPendingOrders })

  const { showNewOrderModal, creating, calculateTotalAmount, handleCreateOrder, openModal, closeModal } =
    useOrderCreation(form, isConnected, refetch)

  const { orders, totalPages } = useMemo(
    () => ({
      orders: data?.data || [],
      totalPages: data?.pagination.totalPages || 1,
    }),
    [data]
  )

  const handlePageChangeWithTotal = useCallback(
    (newPage: number) => {
      handlePageChange(newPage, totalPages)
    },
    [handlePageChange, totalPages]
  )

  return (
    <Layout className="flex flex-row h-screen overflow-hidden">
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      <Layout className="flex flex-col flex-1">
        <HeaderComp />

        <Content className="flex-1 overflow-y-auto bg-gray-100 p-6 gap-4">
          <div className="flex justify-between items-center mb-4">
            <CreateOrderButton onClick={openModal} />
            <ConnectionStatus isConnected={isConnected} />
          </div>

          <OrderFilter
            onSearch={(search) => handleFilterChange({ search })}
            onStatusFilter={(status) => handleFilterChange({ status })}
            onDateFilter={handleDateFilter}
            onSortChange={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
          />

          <OrderTable orders={orders} loading={isLoading} refresh={false} setRefresh={() => refetch()} />

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={handlePageChangeWithTotal} />
        </Content>
      </Layout>

      <Modal title="Create New Order" open={showNewOrderModal} onCancel={closeModal} footer={null}>
        <CreateOrderForm
          onCancel={closeModal}
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
