import React, { FC } from 'react'
import { QuestionInputDefaultProps, QuestionInputPropsType } from './interface'
import { Input } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import TextArea from 'antd/es/input/TextArea'

const QuestionInput: FC<QuestionInputPropsType> = props => {
  const { title, placeholder, inputType, textAreaRows, name, onChange } = {
    ...QuestionInputDefaultProps,
    ...props
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange?.(e.target.value)
  }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      {inputType === 'text' && (
        <Input placeholder={placeholder} name={name} onChange={handleChange} />
      )}
      {inputType === 'textArea' && (
        <TextArea
          placeholder={placeholder}
          rows={textAreaRows}
          name={name}
          onChange={handleChange}
        />
      )}
    </div>
  )
}

export default QuestionInput
