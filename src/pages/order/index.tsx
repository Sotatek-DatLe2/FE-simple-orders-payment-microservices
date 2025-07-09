import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Layout } from 'antd'
import { useParams } from 'react-router-dom'
import { hideLoading, showLoading } from 'src/stores/loading.store'
import HeaderComp from 'src/components/header'
import SidebarComp from 'src/components/sidebar'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import { Order, OrderDetailResponse } from 'src/types'
import { OrderInfo } from './components/orderInfo'
import { OrderTimeline } from './components/orderTimeline'

const { Content } = Layout

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
      const response: AxiosResponse<any> = await ordersService.getOrderById(orderId)
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
    <div className="h-screen overflow-hidden flex flex-row w-full">
      <SidebarComp sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Layout className="flex-1 flex flex-col w-full">
        <HeaderComp />
        <Content className="flex-1 overflow-y-auto bg-gray-100 p-6">
          {loading && <div className="text-center p-6 text-base text-gray-600">Loading order details...</div>}
          {error && <div className="text-center p-6 text-base text-red-600">{error}</div>}
          {!loading && !error && !order && (
            <div className="text-center p-6 text-base text-gray-500">No order data available</div>
          )}
          {!loading && !error && order && (
            <>
              <OrderInfo order={order} />
              <OrderTimeline order={order} />
            </>
          )}
        </Content>
      </Layout>
    </div>
  )
}

export default OrderDetail
