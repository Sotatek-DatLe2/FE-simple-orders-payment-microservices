import React from 'react'
import { Order } from 'src/types'
import { Tag } from 'antd'
import { getColorByState } from 'src/utils/stateColor'

export const OrderInfo: React.FC<{ order: Order }> = ({ order }) => (
  <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto mb-6">
    <h2 className="text-2xl mb-4 text-gray-800 font-semibold">Order Details</h2>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">Order ID</span>
      <span className="text-gray-800">{order.orderId}</span>
    </div>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">User ID</span>
      <span className="text-gray-800">{order.userId}</span>
    </div>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">Created At</span>
      <span className="text-gray-800">{new Date(order.createdAt).toLocaleString()}</span>
    </div>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">Status</span>
      <span className="text-gray-800">
        <Tag color={getColorByState(order.state)}>{order.state}</Tag>
      </span>
    </div>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">Total Amount</span>
      <span className="text-gray-800">${order.totalAmount.toLocaleString()}</span>
    </div>

    <div className="flex justify-between py-2 border-b border-gray-200">
      <span className="font-semibold text-gray-600">Updated At</span>
      <span className="text-gray-800">{new Date(order.updatedAt).toLocaleString()}</span>
    </div>

    <div className="flex justify-between py-2">
      <span className="font-semibold text-gray-600">Cancelled At</span>
      <span className="text-gray-800">{order.cancelledAt ? new Date(order.cancelledAt).toLocaleString() : 'N/A'}</span>
    </div>
  </div>
)
