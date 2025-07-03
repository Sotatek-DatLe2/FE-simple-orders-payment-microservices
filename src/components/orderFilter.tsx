import React from 'react'
import { OrderFilterProps } from 'src/types'
import { Select, DatePicker } from 'antd'

const { Option } = Select
const { RangePicker } = DatePicker

export const OrderFilter: React.FC<OrderFilterProps> = ({ onSearch, onStatusFilter, onDateFilter, onSortChange }) => (
  <div className="flex flex-wrap gap-4 mb-4">
    <Select style={{ width: 200 }} placeholder="Filter by status" onChange={onStatusFilter} allowClear>
      <Option value="delivered">Delivered</Option>
      <Option value="cancelled">Cancelled</Option>
    </Select>
    <RangePicker onChange={onDateFilter} format="YYYY-MM-DD" style={{ width: 300 }} />
    <Select
      style={{ width: 200 }}
      placeholder="Sort by"
      onChange={(value) => {
        const [sortBy, sortOrder] = value.split(':')
        onSortChange(sortBy, sortOrder)
      }}
      allowClear
      defaultValue={'createdAt:DESC'}
    >
      <Option value="createdAt:ASC">Date: Ascending</Option>
      <Option value="createdAt:DESC">Date: Descending</Option>
      <Option value="totalAmount:ASC">Price: Ascending</Option>
      <Option value="totalAmount:DESC">Price: Descending</Option>
    </Select>
  </div>
)
