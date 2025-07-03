import React, { useState } from 'react'
import { Table, Tag, Empty, Modal, Tooltip, notification } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { OrderTableProps } from 'src/types'
import { InfoCircleTwoTone, DeleteTwoTone } from '@ant-design/icons'
import { useCancelOrder } from 'src/hooks/useCancelOrder'

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading, onCancelSuccess }) => {
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const { mutate: cancelOrder, isPending } = useCancelOrder()

  const columns: ColumnsType<any> = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      sorter: (a, b) => a.orderId.localeCompare(b.orderId),
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
      dataIndex: 'state',
      key: 'state',
      render: (state: string) => {
        const statusMap: { [key: string]: string } = {
          delivered: 'green',
          cancelled: 'red',
          confirmed: 'orange',
        }
        return <Tag color={statusMap[state] || 'default'}>{state.charAt(0).toUpperCase() + state.slice(1)}</Tag>
      },
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
        <span className="flex items-center gap-2">
          <a href={`/order/${record.orderId}`}>
            <Tooltip title="View Details">
              <InfoCircleTwoTone className="text-xl text-blue-500 cursor-pointer hover:text-blue-400" />
            </Tooltip>
          </a>
          {record.state === 'confirmed' && (
            <Tooltip title="Cancel Order">
              <DeleteTwoTone
                className="text-xl text-red-500 cursor-pointer hover:text-red-400"
                onClick={() => setCancelOrderId(record.orderId)}
              />
            </Tooltip>
          )}
        </span>
      ),
    },
  ]

  const handleOk = () => {
    if (!cancelOrderId) return
    cancelOrder(cancelOrderId, {
      onSuccess: () => {
        notification.success({
          message: `Order ${cancelOrderId} cancelled successfully`,
        })
        setCancelOrderId(null)
        onCancelSuccess?.()
      },
      onError: () => {
        notification.error({
          message: 'Failed to cancel order. Please try again.',
        })
        setCancelOrderId(null)
      },
    })
  }

  return (
    <div className="p-6 relative">
      <Table columns={columns} dataSource={orders} rowKey="orderId" pagination={false} loading={loading || isPending} />
      {(!orders || orders.length === 0) && (
        <div className="text-center py-6">
          <Empty description="No orders found" />
        </div>
      )}
      <Modal
        title="Confirm Cancellation"
        open={!!cancelOrderId}
        onOk={handleOk}
        onCancel={() => setCancelOrderId(null)}
        okText="Yes"
        okType="danger"
        cancelText="No"
      >
        <p>This action cannot be undone.</p>
      </Modal>
    </div>
  )
}

export default OrderTable
