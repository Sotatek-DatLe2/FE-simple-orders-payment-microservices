import React from 'react'
import { Tooltip, Modal } from 'antd'
import { InfoCircleTwoTone, CloseCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import { Order } from 'src/types'
import { useDeleteOrder } from 'src/hooks/useDeleteOrder'

interface OrderActionsProps {
  order: Order
  onCancelOrder: (orderId: string) => void
}

export const OrderActions: React.FC<OrderActionsProps> = ({ order, onCancelOrder }) => {
  const { mutate: deleteOrder } = useDeleteOrder()

  const handleDeleteOrder = () => {
    Modal.confirm({
      title: 'Delete Order',
      content: 'Are you sure you want to delete this order?',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteOrder(order.id),
    })
  }

  return (
    <span className="flex items-center align-center gap-2">
      <a href={`/order/${order.id}`}>
        <Tooltip title="View Details">
          <InfoCircleTwoTone className="text-xl align-top text-blue-500 cursor-pointer hover:text-blue-400" />
        </Tooltip>
      </a>
      
      <Tooltip title="Delete Order">
        <DeleteOutlined 
          className="text-xl align-top text-red-500 cursor-pointer hover:text-red-400"
          onClick={handleDeleteOrder}
        />
      </Tooltip>
      
      {order.status === 'confirmed' && (
        <Tooltip title="Cancel Order">
          <CloseCircleOutlined
            className="text-xl align-top text-red-500 cursor-pointer hover:text-red-400"
            onClick={() => onCancelOrder(order.id)}
          />
        </Tooltip>
      )}
    </span>
  )
}