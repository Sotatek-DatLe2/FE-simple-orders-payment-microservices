import React from 'react'
import { OrderFilterProps } from 'src/types'
import styled from 'styled-components'
import { Input, Select, DatePicker } from 'antd'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker

const FilterContainer = styled.div`
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`

const StyledSearch = styled(Search)`
  width: 300px;
`

export const OrderFilter: React.FC<OrderFilterProps> = ({ onSearch, onStatusFilter, onDateFilter }) => (
  <FilterContainer>
    <StyledSearch placeholder="Search by Order ID" onSearch={onSearch} enterButton />
    <Select style={{ width: 200 }} placeholder="Filter by status" onChange={onStatusFilter} allowClear>
      <Option value="delivered">Delivered</Option>
      <Option value="cancelled">Cancelled</Option>
    </Select>
    <RangePicker onChange={onDateFilter} format="YYYY-MM-DD" style={{ width: 300 }} />
  </FilterContainer>
)
