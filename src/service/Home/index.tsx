import { AxiosResponse } from 'axios'
import { get, post, put } from 'src/service/axiousClient'
import { getAuthorizationHeader } from 'src/utils/auth'
import { API_URL } from 'src/service'
import create from '@ant-design/icons/lib/components/IconFont'
import { NewOrder } from 'src/types'

const { api } = API_URL

const ordersService = {
  getOrders({
    page = 1,
    search = '',
    status = '',
    startDate = '',
    endDate = '',
    sortBy = '',
    sortOrder = '',
  }): Promise<AxiosResponse> {
    return get(`${api}/orders/`, {
      headers: getAuthorizationHeader(),
      params: {
        page,
        search,
        status,
        startDate,
        endDate,
        sortBy,
        sortOrder,
      },
    })
  },
  getOrderById(orderId: string): Promise<AxiosResponse> {
    return get(`${api}/orders/${orderId}`, {
      headers: getAuthorizationHeader(),
    })
  },
  cancelOrder(orderId: string): Promise<AxiosResponse> {
    return put(
      `${api}/orders/${orderId}/cancel`,
      {},
      {
        headers: getAuthorizationHeader(),
      }
    )
  },
  createOrder(orderData: any): Promise<AxiosResponse> {
    return post(
      `${api}/orders/`,
      {
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
      },
      {
        headers: getAuthorizationHeader(),
      }
    )
  },
}

export default ordersService
