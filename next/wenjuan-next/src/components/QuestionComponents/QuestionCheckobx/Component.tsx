import React from 'react'
import {
  QuestionCheckboxDefaultProps,
  QuestionCheckBoxPropsType
} from './interface'
import { Checkbox, Space } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
const QuestionTitle = (props: QuestionCheckBoxPropsType) => {
  const {
    title,
    options = [],
    layout,
    name,
    onChange
  } = { ...QuestionCheckboxDefaultProps, ...props }

  const handleChange = (values: string[]) => {
    onChange?.(values.join(','))
  }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <Checkbox.Group name={name} onChange={handleChange}>
        <Space direction={layout}>
          {options.map((item, index) => {
            return (
              <Checkbox key={index} value={item.label}>
                {item.label}
              </Checkbox>
            )
          })}
        </Space>
      </Checkbox.Group>
    </div>
  )
}

export default QuestionTitle
