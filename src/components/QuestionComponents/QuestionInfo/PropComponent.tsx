import React, { useEffect } from 'react'
import {
  Checkbox,
  Col,
  ColorPicker,
  Divider,
  Form,
  Input,
  Row,
  Select,
  theme,
  Slider,
  InputNumber
} from 'antd'
import { QuestionInfoPropsType } from './interface'
import { generate, presetPalettes, red } from '@ant-design/colors'
import type { ColorPickerProps } from 'antd'

type Presets = Required<ColorPickerProps>['presets'][number]
export default function PropComponent(props: QuestionInfoPropsType) {
  const [form] = Form.useForm()
  const { onChange, disabled } = props

  const handleValuesChange = () => {
    const values = form.getFieldsValue()
    if (values.titleColor && typeof values.titleColor.toHexString === 'function') {
      values.titleColor = values.titleColor.toHexString()
    }
    if (values.textColor && typeof values.textColor.toHexString === 'function') {
      values.textColor = values.textColor.toHexString()
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
      <Divider>标题设置</Divider>

      <Form.Item<QuestionInfoPropsType> label="标题" name={'title'}>
        <Input />
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="标题层级" name={'titleLevel'}>
        <Select options={[1, 2, 3, 4, 5].map(item => ({ label: item, value: item }))} />
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="标题颜色" name={'titleColor'}>
        <ColorPicker
          presets={presets}
          onChange={color => {
            const hexColor = color.toHexString()
            form.setFieldValue('titleColor', hexColor)
          }}
        />
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="" name={'titleIsCenter'} valuePropName="checked">
        <Checkbox>标题是否居中</Checkbox>
      </Form.Item>

      <Divider>描述设置</Divider>

      <Form.Item<QuestionInfoPropsType> label="内容" name={'text'}>
        <Input.TextArea rows={4} />
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="内容颜色" name={'textColor'}>
        <ColorPicker
          presets={presets}
          onChange={color => {
            const hexColor = color.toHexString()
            form.setFieldValue('textColor', hexColor)
          }}
        />
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="内容距离标题的距离" name={'textMarginTop'}>
        <Row>
          <Col span={12}>
            <Slider
              min={5}
              max={20}
              value={form.getFieldValue('textMarginTop')}
              onChange={value => {
                form.setFieldValue('textMarginTop', value)
                handleValuesChange()
              }}
            />
          </Col>
          <Col span={4}>
            <InputNumber
              min={5}
              max={20}
              style={{ margin: '0 16px' }}
              value={form.getFieldValue('textMarginTop')}
              onChange={value => {
                form.setFieldValue('textMarginTop', value)
                handleValuesChange()
              }}
            />
          </Col>
        </Row>
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="" name={'textStrong'} valuePropName="checked">
        <Checkbox>内容是否加粗</Checkbox>
      </Form.Item>

      <Form.Item<QuestionInfoPropsType> label="" name={'textIsCenter'} valuePropName="checked">
        <Checkbox>内容是否居中</Checkbox>
      </Form.Item>
    </Form>
  )
}
