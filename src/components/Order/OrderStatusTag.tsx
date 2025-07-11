import React from 'react'
import { Tag } from 'antd'
import { ORDER_STATUS_MAP } from 'src/const/orderStatus'

interface OrderStatusTagProps {
  status: string
}

export const OrderStatusTag: React.FC<OrderStatusTagProps> = ({ status }) => {
  const color = ORDER_STATUS_MAP[status as keyof typeof ORDER_STATUS_MAP] || 'default'
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1)

  return <Tag color={color}>{displayStatus}</Tag>
}