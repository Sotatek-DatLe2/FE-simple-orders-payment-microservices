import { AxiosResponse } from 'axios'
import { get, post, put } from 'src/service/axiousClient'
import { getAuthorizationHeader } from 'src/utils/auth'
import { API_URL } from 'src/service'
import { NewOrder } from 'src/types'

const { api } = API_URL

interface GetOrdersParams {
  page?: number
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: string
}

const ordersService = {
  getOrders({
    page = 1,
    status = '',
    startDate = '',
    endDate = '',
    sortBy = '',
    sortOrder = '',
  }: GetOrdersParams): Promise<AxiosResponse> {
    return get(`${api}/orders/`, {
      headers: getAuthorizationHeader(),
      params: {
        page,
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

  async createOrder(orderData: Pick<NewOrder, 'userId' | 'totalAmount'>): Promise<AxiosResponse> {
    const response = await post(
      `${api}/orders/`,
      {
        userId: orderData.userId,
        totalAmount: orderData.totalAmount,
      },
      {
        headers: getAuthorizationHeader(),
      }
    )

    if (response.status !== 200 && response.status !== 201) {
      const error = new Error(response.data?.message || 'Order creation failed')
      throw error
    }

    return response
  },
}

export default ordersService
