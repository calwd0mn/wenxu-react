import React from 'react'
import { QuestionCheckboxDefaultProps, QuestionCheckBoxPropsType } from './interface'
import { Checkbox, Space, Typography } from 'antd'
const { Paragraph } = Typography

export default function QuestionTitle(props: QuestionCheckBoxPropsType) {
  const { title, options = [], layout } = { ...QuestionCheckboxDefaultProps, ...props }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Space direction={layout}>
        {options.map((item, index) => {
          return (
            <Checkbox key={index} value={item.label} checked={item.checked}>
              {item.label}
            </Checkbox>
          )
        })}
      </Space>
    </div>
  )
}
