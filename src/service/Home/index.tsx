import { AxiosResponse } from 'axios'
import { get, post, put, deleteReq } from 'src/service/axiousClient'
import { getAuthorizationHeader } from 'src/utils/auth'
import { API_URL } from 'src/service'
import { NewOrder } from 'src/types'

interface GetOrdersParams {
  page?: number
  status?: string
  startDate?: string
  endDate?: string
  sortBy?: string
  sortOrder?: string
  limit?: number
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
    return get(`orders/`, {
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
    return get(`orders/${orderId}`, {
      headers: getAuthorizationHeader(),
    })
  },

  cancelOrder(orderId: string): Promise<AxiosResponse> {
    return put(
      `orders/${orderId}`,
      {
        status: 'cancelled',
        reason: 'User requested cancellation',
        id: orderId,
      },
      {
        headers: getAuthorizationHeader(),
      }
    )
  },

  async createOrder(
    orderData: Pick<NewOrder, 'customerName' | 'totalAmount' | 'paymentDetails'>
  ): Promise<AxiosResponse> {
    const response = await post(
      `orders/`,
      {
        customerName: orderData.customerName || 'Le Tien Dat',
        paymentDetails: orderData.paymentDetails,
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

  async deleteOrder(orderId: string): Promise<AxiosResponse> {
    const response = await deleteReq(`orders/${orderId}`)

    if (response.status !== 200 && response.status !== 204) {
      const error = new Error(response.data?.message || 'Order deletion failed')
      throw error
    }

    return response
  },
}

export default ordersService
