import React from 'react'
import { Dayjs } from 'dayjs'
import {
  QuestionDatePickerPropsType,
  QuestionDatePickerDefaultProps
} from './interface'
import { DatePicker, ConfigProvider } from 'antd'
import Paragraph from 'antd/es/typography/Paragraph'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')

export default function QuestionDatePick(props: QuestionDatePickerPropsType) {
  const { title, placeholder, type, format, name, onChange } = {
    ...QuestionDatePickerDefaultProps,
    ...props
  }

  const handleChange = (value: Dayjs | null) => {
    onChange?.(value ? value.format(format) : '')
  }

  return (
    <div>
      <Paragraph strong>{title}</Paragraph>
      <ConfigProvider locale={zhCN}>
        <DatePicker
          placeholder={placeholder}
          type={type}
          format={format}
          name={name}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      </ConfigProvider>
    </div>
  )
}
