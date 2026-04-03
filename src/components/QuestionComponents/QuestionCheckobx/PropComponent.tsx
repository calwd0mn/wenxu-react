import React, { useEffect } from 'react'
import { Form, Input, Button, Flex, Radio, Checkbox } from 'antd'
import { QuestionCheckBoxPropsType, QuestionCheckItemPropsType } from './interface'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'
import { nanoid } from 'nanoid'

export default function PropComponent(props: QuestionCheckBoxPropsType) {
  const [form] = Form.useForm()
  const { onChange, disabled } = props

  const handleValuesChange = () => {
    const values = form.getFieldsValue()
    if (onChange) {
      onChange(values)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      ...props
    })
  }, [props])

  return (
    <Form
      form={form}
      disabled={disabled}
      layout="vertical"
      initialValues={props}
      onValuesChange={handleValuesChange}
    >
      <Form.Item<QuestionCheckBoxPropsType> label="标题" name="title">
        <Input />
      </Form.Item>

      <Form.Item<QuestionCheckBoxPropsType> label="选项">
        <Form.List name="options">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex key={key} align="center" gap={10} style={{ marginBottom: 10 }}>
                  <Form.Item
                    name={[name, 'checked']}
                    style={{ marginBottom: 0 }}
                    valuePropName="checked"
                  >
                    <Checkbox />
                  </Form.Item>
                  <Form.Item
                    {...restField}
                    name={[name, 'label']}
                    rules={[
                      { required: true, message: '选项不能为空' },
                      {
                        validator: () => {
                          const values = form.getFieldValue('options')
                          const valueSet = new Set(
                            values.map((item: QuestionCheckItemPropsType) => item.label)
                          )

                          if (valueSet.size !== values.length) {
                            return Promise.reject(new Error('选项不能重复'))
                          }
                          return Promise.resolve()
                        }
                      }
                    ]}
                    style={{ flex: 1, marginBottom: 0 }}
                  >
                    <Input placeholder="请输入选项内容" />
                  </Form.Item>
                  <div style={{ cursor: 'pointer', fontSize: 16, color: '#ff4d4f' }}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </div>
                </Flex>
              ))}
              <Button
                type="dashed"
                onClick={() => add({ label: '新选项', value: nanoid(5) })}
                block
                icon={<PlusCircleOutlined />}
              >
                添加选项
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item<QuestionCheckBoxPropsType> label="排列方式" name={'layout'}>
        <Radio.Group
          options={[
            { value: 'horizontal', label: '横向' },
            { value: 'vertical', label: '纵向' }
          ]}
        />
      </Form.Item>
    </Form>
  )
}
