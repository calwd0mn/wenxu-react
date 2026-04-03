import React, { useEffect } from 'react'
import { Checkbox, ColorPicker, Form, Input, Select, theme } from 'antd'
import { QuestionTitlePropsType } from './interface'
import { generate, presetPalettes, red } from '@ant-design/colors'
import type { ColorPickerProps } from 'antd'

type Presets = Required<ColorPickerProps>['presets'][number]
export default function PropComponent(props: QuestionTitlePropsType) {
  const [form] = Form.useForm()
  const { onChange, disabled } = props

  const handleValuesChange = () => {
    const values = form.getFieldsValue()
    if (values.color && typeof values.color.toHexString === 'function') {
      values.color = values.color.toHexString()
    }

    if (onChange) {
      onChange(values)
    }
  }

  useEffect(() => {
    form.setFieldsValue({
      ...props
    })
  }, [props])

  function genPresets(presets = presetPalettes) {
    return Object.entries(presets).map<Presets>(([label, colors]) => ({
      label,
      colors,
      key: label
    }))
  }
  const { token } = theme.useToken()
  const presets = genPresets({ primary: generate(token.colorPrimary), red })

  return (
    <Form
      form={form}
      disabled={disabled}
      layout="vertical"
      initialValues={props}
      onValuesChange={handleValuesChange}
    >
      <Form.Item<QuestionTitlePropsType> label="标题" name={'text'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionTitlePropsType> label="层级" name={'level'}>
        <Select options={[1, 2, 3, 4, 5].map(item => ({ label: item, value: item }))} />
      </Form.Item>

      <Form.Item<QuestionTitlePropsType> label="颜色" name={'color'}>
        <ColorPicker
          presets={presets}
          onChange={color => {
            const hexColor = color.toHexString()
            form.setFieldValue('color', hexColor)
          }}
        />
      </Form.Item>

      <Form.Item<QuestionTitlePropsType> label="" name={'isCenter'} valuePropName="checked">
        <Checkbox>居中</Checkbox>
      </Form.Item>
    </Form>
  )
}
