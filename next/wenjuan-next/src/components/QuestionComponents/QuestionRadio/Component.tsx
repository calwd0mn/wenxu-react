import React from 'react'
import { QuestionRadioDefaultProps, QuestionRadioPropsType } from './interface'
import { Radio, RadioChangeEvent, Space } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'

export default function QuestionTitle(props: QuestionRadioPropsType) {
  const {
    title,
    values = [],
    layout,
    name,
    onChange
  } = { ...QuestionRadioDefaultProps, ...props }

  const handleChange = (e: RadioChangeEvent) => {
    const newValue = e.target.value
    onChange?.(newValue)
  }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Radio.Group name={name} onChange={handleChange}>
        <Space direction={layout}>
          {values.map((item, index) => {
            return (
              <Radio key={index} value={item}>
                {item}
              </Radio>
            )
          })}
        </Space>
      </Radio.Group>
    </div>
  )
}
