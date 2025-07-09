import React from 'react'
import { Timeline } from 'antd'
import { getColorByState } from 'src/utils/stateColor'
import { Order } from 'src/types'

interface OrderTimelineProps {
  order: Order
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const timelineItems = order.history
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .map((history) => ({
      label: history.status.charAt(0).toUpperCase() + history.status.slice(1),
      date: new Date(history.createdAt).toLocaleString(),
      color: getColorByState(history.status),
    }))

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-xl mx-auto">
      <h3 className="text-xl mb-4 text-gray-800 font-semibold">Order Status Timeline</h3>
      <Timeline mode="left">
        {timelineItems.map((item, index) => (
          <Timeline.Item key={index} color={item.color} label={item.date}>
            {item.label}
          </Timeline.Item>
        ))}
      </Timeline>
    </div>
  )
}
