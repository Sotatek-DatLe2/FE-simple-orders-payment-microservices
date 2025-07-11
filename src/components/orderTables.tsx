import React from 'react'
import { Table, Empty } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Order, OrderTableProps } from 'src/types/index'
import { OrderStatusTag } from 'src/components/Order/OrderStatusTag'
import { OrderActions } from 'src/components/Order/OrderActions'
import { CancelOrderModal } from 'src/components/Order/CancelOrderModal'
import { useOrderCancellation } from 'src/hooks/useOrderCancellation'
import { usePendingCancelOrders } from 'src/hooks/usePendingCancelOrders'
import { useSocketStatus } from '../hooks/useSocketStatus'
import { useCancelOrder } from '../hooks/useCancelOrder'
import { OrderDisplayTableProps } from 'src/types'

const OrderTable: React.FC<OrderDisplayTableProps> = ({ orders, loading, onCancelSuccess }) => {
  const { isPending } = useCancelOrder()
  const { resendPendingCancellations } = usePendingCancelOrders(onCancelSuccess)
  const {
    cancelOrderId,
    handleCancelOrder,
    confirmCancelOrder,
    cancelCancelOrder,
  } = useOrderCancellation(onCancelSuccess)

  useSocketStatus({ onReconnect: resendPendingCancellations })

  const columns: ColumnsType<Order> = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'orderId',
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) => new Date(createdAt).toLocaleString(),
      sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <OrderStatusTag status={status} />,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (totalAmount: number) => `$${totalAmount.toLocaleString()}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <OrderActions order={record} onCancelOrder={handleCancelOrder} />
      ),
    },
  ]

  const safeOrders = Array.isArray(orders) ? orders : []
  const hasOrders = safeOrders.length > 0

  return (
    <div className="p-6 relative">
      <Table
        columns={columns}
        dataSource={safeOrders}
        rowKey="orderId"
        pagination={false}
        loading={loading || isPending}
      />
      
      {!hasOrders && (
        <div className="text-center py-6">
          <Empty description="No orders found" />
        </div>
      )}
      
      <CancelOrderModal
        isOpen={!!cancelOrderId}
        onConfirm={confirmCancelOrder}
        onCancel={cancelCancelOrder}
      />
    </div>
  )
}

export default OrderTable