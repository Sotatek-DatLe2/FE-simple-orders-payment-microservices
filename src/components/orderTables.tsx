import React, { useState } from 'react'
import { Table, Tag, Empty, Modal, message, Tooltip } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { OrderTableProps } from 'src/types'
import styled from 'styled-components'
import { InfoCircleTwoTone, DeleteTwoTone } from '@ant-design/icons'
import ordersService from 'src/service/Home'
import { AxiosResponse } from 'axios'
import { notification } from 'antd'
import CustomNotification from './customNoti'

const EmptyContainer = styled.div`
  text-align: center;
  padding: 24px;
`

const TableContainer = styled.div`
  padding: 24px;
  position: relative;
`

const InfoIcon = styled(InfoCircleTwoTone)`
  font-size: 20px;
  color: #1890ff;
  cursor: pointer;
  transition: color 0.3s;

  &:hover {
    color: #40a9ff;
  }
`

const DeleteIcon = styled(DeleteTwoTone)`
  font-size: 20px;
  color: #ff4d4f;
  cursor: pointer;
  transition: color 0.3s;
  margin-left: 8px;

  &:hover {
    color: #ff7875;
  }
`

const ActionGroup = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`

const handleCancelOrder = async (
  orderId: string,
  onSuccess: () => void,
  setCancelOrderId: (orderId: string | null) => void
) => {
  setCancelOrderId(orderId)
}

const OrderTable: React.FC<OrderTableProps> = ({ orders, loading, onCancelSuccess, refresh, setRefresh }) => {
  const [cancelOrderId, setCancelOrderId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

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
        <ActionGroup>
          <a href={`/order/${record.orderId}`}>
            <Tooltip title="View Details">
              <InfoIcon />
            </Tooltip>
          </a>
          {record.state === 'confirmed' && (
            <Tooltip title="Cancel Order">
              <DeleteIcon
                onClick={() =>
                  handleCancelOrder(
                    record.orderId,
                    onCancelSuccess || (() => console.log('No success callback')),
                    setCancelOrderId
                  )
                }
              />
            </Tooltip>
          )}
        </ActionGroup>
      ),
    },
  ]

  const handleOk = async () => {
    if (!cancelOrderId) return
    try {
      const cancelResponse: AxiosResponse = await ordersService.cancelOrder(cancelOrderId)
      if (cancelResponse.status === 200) {
        console.log(`Order ${cancelOrderId} cancelled successfully`)
        setNotification({ message: `Order ${cancelOrderId} cancelled successfully`, type: 'success' })
        setTimeout(() => setNotification(null), 3000) // Hide after 3 seconds
        setRefresh && setRefresh(!refresh)
        onCancelSuccess?.()
      } else {
        setNotification({ message: cancelResponse.data?.message || 'Unknown error', type: 'error' })
        setTimeout(() => setNotification(null), 3000)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error'
      setNotification({ message: `Failed to cancel order: ${errorMsg}`, type: 'error' })
      setTimeout(() => setNotification(null), 3000)
    } finally {
      setCancelOrderId(null)
    }
  }

  const handleCancel = () => {
    setCancelOrderId(null)
  }

  return (
    <TableContainer>
      <Table columns={columns} dataSource={orders} rowKey="orderId" pagination={false} loading={loading} />
      {!orders || orders.length === 0 ? (
        <EmptyContainer>
          <Empty description="No orders found" />
        </EmptyContainer>
      ) : null}
      <Modal
        title="Confirm Cancellation"
        open={!!cancelOrderId} // convert from string to boolean
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Yes"
        okType="danger"
        cancelText="No"
      >
        <p>This action cannot be undone.</p>
      </Modal>
      {notification && <CustomNotification message={notification.message} type={notification.type} />}
    </TableContainer>
  )
}

export default OrderTable
