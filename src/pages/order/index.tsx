import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { useDispatch } from 'react-redux'
import { Layout, Timeline, Tag } from 'antd'
import { useParams } from 'react-router-dom'
import { hideLoading, showLoading } from 'src/stores/loading.store'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import { Order } from 'src/types'

const { Content } = Layout

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
`

const OrderCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 600px;
  margin: 0 auto 24px;
`

const OrderTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
  color: #333;
`

const OrderField = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #eee;
`

const FieldLabel = styled.span`
  font-weight: 600;
  color: #555;
`

const FieldValue = styled.span`
  color: #333;
`

const TimelineContainer = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  max-width: 600px;
  margin: 0 auto;
`

const TimelineTitle = styled.h3`
  font-size: 20px;
  margin-bottom: 16px;
  color: #333;
`

const LoadingSpinner = styled.div`
  text-align: center;
  padding: 24px;
  font-size: 16px;
  color: #555;
`

const ErrorMessage = styled.div`
  text-align: center;
  padding: 24px;
  color: #dc3545;
  font-size: 16px;
`

const EmptyState = styled.div`
  text-align: center;
  padding: 24px;
  color: #6c757d;
  font-size: 16px;
`

interface OrderInfoProps {
  order: Order
}

const getColorByState = (state: string): string => {
  switch (state) {
    case 'delivered':
      return 'green'
    case 'cancelled':
      return 'red'
    case 'confirmed':
      return 'orange'
    default:
      return 'blue'
  }
}

const OrderInfo: React.FC<OrderInfoProps> = ({ order }) => (
  <OrderCard>
    <OrderTitle>Order Details</OrderTitle>
    <OrderField>
      <FieldLabel>Order ID</FieldLabel>
      <FieldValue>{order.orderId}</FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>User ID</FieldLabel>
      <FieldValue>{order.userId}</FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>Created At</FieldLabel>
      <FieldValue>{new Date(order.createdAt).toLocaleString()}</FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>Status</FieldLabel>
      <FieldValue>
        <Tag color={getColorByState(order.state)}>{order.state}</Tag>
      </FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>Total Amount</FieldLabel>
      <FieldValue>${order.totalAmount.toLocaleString()}</FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>Updated At</FieldLabel>
      <FieldValue>{new Date(order.updatedAt).toLocaleString()}</FieldValue>
    </OrderField>
    <OrderField>
      <FieldLabel>Cancelled At</FieldLabel>
      <FieldValue>{order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : 'N/A'}</FieldValue>
    </OrderField>
  </OrderCard>
)

interface OrderTimelineProps {
  order: Order
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  // Sort history by createdAt in descending order and map to timeline items
  const timelineItems = [
    ...order.history
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .map((history) => ({
        label: history.state.charAt(0).toUpperCase() + history.state.slice(1),
        date: new Date(history.createdAt).toLocaleString(),
        color: getColorByState(history.state),
      })),
  ]

  return (
    <TimelineContainer>
      <TimelineTitle>Order Status Timeline</TimelineTitle>
      <Timeline mode="left">
        {timelineItems.map((item, index) => (
          <Timeline.Item key={index} color={item.color} label={item.date}>
            {item.label}
          </Timeline.Item>
        ))}
      </Timeline>
    </TimelineContainer>
  )
}

const OrderDetail: React.FC = () => {
  const dispatch = useDispatch()
  const { orderId } = useParams<{ orderId: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const fetchOrder = async () => {
    if (!orderId) {
      setError('No order ID provided')
      return
    }

    try {
      setLoading(true)
      setError(null)
      dispatch(showLoading())
      const response: AxiosResponse<Order> = await ordersService.getOrderById(orderId)
      if (response.data) {
        setOrder(response.data)
      } else {
        setError('Order not found')
      }
    } catch (error) {
      console.error('Error fetching order:', error)
      setError('Failed to fetch order details')
    } finally {
      setLoading(false)
      dispatch(hideLoading())
    }
  }

  useEffect(() => {
    fetchOrder()
  }, [])

  return (
    <HomeContainer>
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Layout>
        <HeaderComp setSidebarOpen={setSidebarOpen} />
        <MainContent>
          {loading && <LoadingSpinner>Loading order details...</LoadingSpinner>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          {!loading && !error && !order && <EmptyState>No order data available</EmptyState>}
          {!loading && !error && order && (
            <>
              <OrderInfo order={order} />
              <OrderTimeline order={order} />
            </>
          )}
        </MainContent>
      </Layout>
    </HomeContainer>
  )
}

export default OrderDetail
