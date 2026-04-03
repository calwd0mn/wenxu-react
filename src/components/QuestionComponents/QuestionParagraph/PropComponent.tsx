import React, { useEffect } from 'react'
import { Checkbox, ColorPicker, Form, Input, theme } from 'antd'
import { QuestionParagraphPropsType } from './interface'
import { generate, presetPalettes, red } from '@ant-design/colors'
import type { ColorPickerProps } from 'antd'
const { TextArea } = Input

type Presets = Required<ColorPickerProps>['presets'][number]
export default function PropComponent(props: QuestionParagraphPropsType) {
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
      <Form.Item<QuestionParagraphPropsType> label="标题" name={'text'}>
        <TextArea rows={7}/>
      </Form.Item>

      <Form.Item<QuestionParagraphPropsType> label="颜色" name={'color'}>
        <ColorPicker
          presets={presets}
          onChange={color => {
            const hexColor = color.toHexString()
            form.setFieldValue('color', hexColor)
          }}
        />
      </Form.Item>

      <Form.Item<QuestionParagraphPropsType> label="" name={'strong'} valuePropName="checked">
        <Checkbox>加粗</Checkbox>
      </Form.Item>
    </Form>
  )
}
