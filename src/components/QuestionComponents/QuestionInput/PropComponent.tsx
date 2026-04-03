import React, { useEffect } from 'react'
import { Form, Input, InputNumber, Radio } from 'antd'
import { QuestionInputPropsType } from './interface'

export default function PropComponent(props: QuestionInputPropsType) {
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
      <Form.Item<QuestionInputPropsType> label="标题" name={'title'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionInputPropsType> label="Placeholder" name={'placeholder'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionInputPropsType> label="输入框类型" name={'inputType'}>
        <Radio.Group
          value={props.inputType}
          options={[
            { value: 'text', label: '单行输入框' },
            { value: 'textArea', label: '多行输入框' }
          ]}
        />
      </Form.Item>

      {props.inputType === 'textArea' && (
        <Form.Item<QuestionInputPropsType> label="行数" name={'textAreaRows'}>
          <InputNumber style={{ width: '100%' }} min={1} />
        </Form.Item>
      )}
    </Form>
  )
}
