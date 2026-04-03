import React from 'react'
import { QuestionInputDefaultProps, QuestionInputPropsType } from './interface'
import { Input, Typography } from 'antd'

const { Paragraph } = Typography

export default function QuestionInput(props: QuestionInputPropsType) {
  const { title, placeholder, inputType, textAreaRows } = { ...QuestionInputDefaultProps, ...props }
  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      {inputType === 'text' && <Input placeholder={placeholder} />}
      {inputType === 'textArea' && <Input.TextArea placeholder={placeholder} rows={textAreaRows} />}
    </div>
  )
}
