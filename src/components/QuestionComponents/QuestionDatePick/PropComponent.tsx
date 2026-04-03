import React, { useEffect } from 'react'
import { Form, Input, Radio } from 'antd'
import { QuestionDatePickerPropsType } from './interface'

export default function PropComponent(props: QuestionDatePickerPropsType) {
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
      <Form.Item<QuestionDatePickerPropsType> label="标题" name={'title'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionDatePickerPropsType> label="Placeholder" name={'placeholder'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionDatePickerPropsType> label="日期类型" name={'type'}>
        <Radio.Group
          options={[
            { value: 'date', label: '年月日' },
            { value: 'month', label: '月份选择器' },
            { value: 'year', label: '年选择器' }
          ]}
        />
      </Form.Item>

      <Form.Item<QuestionDatePickerPropsType> label="日期格式" name={'format'}>
        <Input />
      </Form.Item>
    </Form>
  )
}
