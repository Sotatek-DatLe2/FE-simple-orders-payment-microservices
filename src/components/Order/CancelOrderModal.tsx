import React from 'react'
import { Modal } from 'antd'

interface CancelOrderModalProps {
  isOpen: boolean
  onConfirm: () => void
  onCancel: () => void
}

export const CancelOrderModal: React.FC<CancelOrderModalProps> = ({
  isOpen,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="Confirm Cancellation"
      open={isOpen}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Yes"
      okType="danger"
      cancelText="No"
    >
      <p>This action cannot be undone.</p>
    </Modal>
  )
}