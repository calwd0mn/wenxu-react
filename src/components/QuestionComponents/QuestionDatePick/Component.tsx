import React from 'react'
import { QuestionDatePickerPropsType, QuestionDatePickerDefaultProps } from './interface'
import { DatePicker, Typography } from 'antd'

export default function QuestionDatePick(props: QuestionDatePickerPropsType) {
  const { title, placeholder, type, format } = { ...QuestionDatePickerDefaultProps, ...props }
  return (
    <div>
      <Typography.Paragraph strong>{title}</Typography.Paragraph>
      <DatePicker placeholder={placeholder} type={type} format={format} style={{ width: '100%' }} />
    </div>
  )
}
