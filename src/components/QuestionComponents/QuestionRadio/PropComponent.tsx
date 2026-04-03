import React, { useEffect } from 'react'
import { Form, Input, Button, Flex, Radio, Select } from 'antd'
import { QuestionRadioPropsType } from './interface'
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons'

export default function PropComponent(props: QuestionRadioPropsType) {
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
      <Form.Item<QuestionRadioPropsType> label="标题" name="title">
        <Input />
      </Form.Item>

      <Form.Item<QuestionRadioPropsType> label="选项">
        <Form.List name="values">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Flex key={key} align="center" gap={10} style={{ marginBottom: 10 }}>
                  <Form.Item
                    {...restField}
                    name={name}
                    rules={[
                      { required: true, message: '选项不能为空' },
                      {
                        validator: (_, value) => {
                          const values = form.getFieldValue('values')
                          const index = values.findIndex((item: string) => item === value)
                          if (index !== -1 && index !== name) {
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
              <Button type="dashed" onClick={() => add()} block icon={<PlusCircleOutlined />}>
                添加选项
              </Button>
            </>
          )}
        </Form.List>
      </Form.Item>

      <Form.Item<QuestionRadioPropsType> label="排列方式" name={'layout'}>
        <Radio.Group
          options={[
            { value: 'horizontal', label: '横向' },
            { value: 'vertical', label: '纵向' }
          ]}
        />
      </Form.Item>

      <Form.Item<QuestionRadioPropsType> label="默认值" name={'defaultValue'}>
        <Select placeholder="请选择默认值" style={{ width: '100%' }} allowClear>
          {props.values?.map((item, index) => {
            return (
              <Select.Option key={index} value={item}>
                {item}
              </Select.Option>
            )
          })}
        </Select>
      </Form.Item>
    </Form>
  )
}
