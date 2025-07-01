import React from 'react'
import { Form, Button, InputNumber, Space, Typography, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { NewOrder } from 'src/types'

interface OrderFormProps {
  onCancel: () => void
  handleCancelModal: () => void
  handleCreateOrder: (values: Omit<NewOrder, 'userId' | 'items'>) => void
  form: any
  calculateTotalAmount: (changedValues: any, allValues: any) => void
}

// Mock product data
const mockProducts = [
  { productId: 'prod1', name: 'Laptop', price: 999.99 },
  { productId: 'prod2', name: 'Smartphone', price: 499.99 },
  { productId: 'prod3', name: 'Headphones', price: 79.99 },
  { productId: 'prod4', name: 'Mouse', price: 29.99 },
]

export const CreateOrderForm: React.FC<OrderFormProps> = ({
  onCancel,
  handleCancelModal,
  handleCreateOrder,
  form,
  calculateTotalAmount,
}) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleCreateOrder}
      initialValues={{
        items: [{ productId: '', quantity: 1 }],
        totalAmount: 0,
      }}
      onValuesChange={calculateTotalAmount}
    >
      <Form.Item label="Total Amount" shouldUpdate>
        {() => <Typography.Text>${(form.getFieldValue('totalAmount') || 0).toFixed(2)}</Typography.Text>}
      </Form.Item>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Space key={key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                <Form.Item
                  {...restField}
                  name={[name, 'productId']}
                  rules={[{ required: true, message: 'Please select a product' }]}
                >
                  <Select placeholder="Select Product" style={{ width: 200 }}>
                    {mockProducts.map((product) => (
                      <Select.Option key={product.productId} value={product.productId}>
                        {product.name} (${product.price.toFixed(2)})
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  {...restField}
                  name={[name, 'quantity']}
                  rules={[{ required: true, message: 'Please enter quantity' }]}
                >
                  <InputNumber min={1} placeholder="Quantity" />
                </Form.Item>
                {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
              </Space>
            ))}
            <Form.Item>
              <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                Add Item
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
          <Button onClick={handleCancelModal}>Cancel</Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrderForm
