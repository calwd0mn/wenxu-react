import React from 'react'
import { QuestionRadioDefaultProps, QuestionRadioPropsType } from './interface'
import { Radio, Space, Typography } from 'antd'
const { Paragraph } = Typography

export default function QuestionTitle(props: QuestionRadioPropsType) {
  const { title, values = [], layout, defaultValue } = { ...QuestionRadioDefaultProps, ...props }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Radio.Group value={defaultValue}>
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
