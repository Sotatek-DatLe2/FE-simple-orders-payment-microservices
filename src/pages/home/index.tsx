import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Input, Select, Layout, DatePicker, Modal, Form, InputNumber, Button, message, Space, Typography } from 'antd'
import { Dayjs } from 'dayjs'
import { hideLoading, showLoading } from 'src/stores/loading.store'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import { ListOrders, NewOrder, Order } from 'src/types'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import OrderTable from 'src/components/orderTables'
import CreateOrderForm from 'src/components/newOrderForm'
import CustomNotification from 'src/components/customNoti'

const { Content } = Layout
// const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const HomeContainer = styled(Layout)`
  height: 100vh;
  overflow: hidden;
  display: flex;
  flex-direction: row;
`

const MainContent = styled(Content)`
  overflow-y: auto;
  background-color: #f8f9fa;
  padding: 24px;
  gap: 16px;
`

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const CreateOrderButton = styled.button`
  padding: 8px 16px;
  margin: 16px 0;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #218838;
  }
`

const PaginationContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin: 16px 0px;
  gap: 8px;
  align-items: center;
`

const PaginationButton = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`

interface PageNumberProps {
  active: boolean
}

const PageNumber = styled.span<PageNumberProps>`
  padding: 8px 12px;
  background-color: ${(props) => (props.active ? '#007bff' : 'white')};
  color: ${(props) => (props.active ? 'white' : '#007bff')};
  border: 1px solid #007bff;
  border-radius: 4px;
  cursor: pointer;
`

interface OrderFilterProps {
  onSearch: (value: string) => void
  onStatusFilter: (value: string) => void
  onDateFilter: (dates: [Dayjs | null, Dayjs | null] | null) => void
  onSortChange: (sortBy: string, sortOrder: string) => void
}

const OrderFilter: React.FC<OrderFilterProps> = ({ onSearch, onStatusFilter, onDateFilter, onSortChange }) => (
  <FilterContainer>
    {/* <StyledSearch placeholder="Search by Order ID" onSearch={onSearch} enterButton /> */}
    <Select style={{ width: 200 }} placeholder="Filter by status" onChange={onStatusFilter} allowClear>
      <Option value="delivered">Delivered</Option>
      <Option value="cancelled">Cancelled</Option>
    </Select>
    <RangePicker onChange={onDateFilter} format="YYYY-MM-DD" style={{ width: 300 }} />
    <Select
      style={{ width: 200 }}
      placeholder="Sort by"
      onChange={(value) => {
        const [sortBy, sortOrder] = value.split(':')
        onSortChange(sortBy, sortOrder)
      }}
      allowClear
      defaultValue={'createdAt:DESC'}
    >
      <Option value="createdAt:ASC">Date: Ascending</Option>
      <Option value="createdAt:DESC">Date: Descbing</Option>
      <Option value="totalAmount:ASC">Price: Ascending</Option>
      <Option value="totalAmount:DESC">Price: Descending</Option>
    </Select>
  </FilterContainer>
)

// Mock product data
const mockProducts = [
  { productId: 'prod1', name: 'Laptop', price: 999.99 },
  { productId: 'prod2', name: 'Smartphone', price: 499.99 },
  { productId: 'prod3', name: 'Headphones', price: 79.99 },
  { productId: 'prod4', name: 'Mouse', price: 29.99 },
]

const Home: React.FC = () => {
  const dispatch = useDispatch()
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false)
  const [orders, setOrders] = useState<ListOrders[]>([])
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
        search: filters.search || '',
        status: filters.status || '',
        startDate: filters.startDate || '',
        endDate: filters.endDate || '',
        sortBy: filters.sortBy || 'createdAt',
        sortOrder: filters.sortOrder || 'DESC',
      })
      const data = Array.isArray(response.data.data) ? response.data.data : []
      setOrders(data)
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
    if (dates && dates[0] !== null && dates[1] !== null) {
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
      const order: Pick<NewOrder, 'userId' | 'totalAmount'> = {
        userId: newOrder.userId,
        totalAmount: newOrder.totalAmount,
      }
      console.log('Creating order with values:', order)
      const response: AxiosResponse<Order> = await ordersService.createOrder(order)
      if (response.data) {
        setNotification({ message: `Order ${response.data.orderId} created successfully`, type: 'success' })
        setTimeout(() => setNotification(null), 2000) // Hide after 2 seconds
        setShowNewOrderModal(false)
        form.resetFields()
        console.log('Order created:', response.data)
        setRefresh(!refresh)
        fetchOrders(page)
      }
    } catch (error) {
      console.error('Error creating order:', error)
      setNotification({ message: 'Failed to create order. Please try again.', type: 'error' })
      setTimeout(() => setNotification(null), 2000) // Hide after 2 seconds
    } finally {
      setLoading(false)
      dispatch(hideLoading())
    }
  }

  const handleShowNewOrderModal = () => {
    setShowNewOrderModal(true)
  }

  const handleCancelModal = () => {
    setShowNewOrderModal(false)
    form.resetFields()
  }

  // Calculate totalAmount based on items
  const calculateTotalAmount = () => {
    const items = form.getFieldValue('items') || []
    const total = items.reduce((sum: number, item: { productId: string; quantity: number }) => {
      const product = mockProducts.find((p) => p.productId === item.productId)
      return sum + (product ? product.price * item.quantity : 0)
    }, 0)
    console.log('Calculated total amount:', total)
    form.setFieldsValue({ totalAmount: total })
    setNewOrder((prev) => ({ ...prev, totalAmount: total }))
  }

  useEffect(() => {
    fetchOrders()
  }, [filters, refresh])

  return (
    <HomeContainer>
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Layout>
        <HeaderComp setSidebarOpen={setSidebarOpen} />
        <MainContent>
          <CreateOrderButton onClick={handleShowNewOrderModal}>+ Create Order</CreateOrderButton>
          <OrderFilter
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onDateFilter={handleDateFilter}
            onSortChange={handleSortChange}
          />
          <OrderTable orders={orders} loading={loading} refresh={refresh} setRefresh={setRefresh} />
          <PaginationContainer>
            <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
              Previous
            </PaginationButton>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <PageNumber key={pageNum} active={pageNum === page} onClick={() => handlePageChange(pageNum)}>
                {pageNum}
              </PageNumber>
            ))}
            <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
              Next
            </PaginationButton>
          </PaginationContainer>
        </MainContent>
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
    </HomeContainer>
  )
}

export default Home
