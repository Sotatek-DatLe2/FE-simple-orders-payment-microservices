import React from 'react'
import { Form, Button, InputNumber, Space, Typography, Select } from 'antd'
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons'
import { MOCK_PRODUCTS } from 'src/utils/dummy'
import { OrderFormProps } from 'src/types'

const CreateOrderForm: React.FC<OrderFormProps> = ({
  onCancel,
  handleCreateOrder,
  form,
  calculateTotalAmount,
  creating,
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
        {() => <Typography.Text>${form.getFieldValue('totalAmount')?.toFixed(2) || '0.00'}</Typography.Text>}
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
                    {MOCK_PRODUCTS.map((product) => (
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
          <Button type="primary" htmlType="submit" loading={creating} className="bg-blue-500 hover:bg-blue-600">
            Submit
          </Button>
          <Button onClick={onCancel} disabled={creating}>
            Cancel
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default CreateOrderForm
