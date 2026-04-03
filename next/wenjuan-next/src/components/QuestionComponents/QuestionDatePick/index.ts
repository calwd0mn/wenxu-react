import Component from './Component'
import { QuestionDatePickerDefaultProps } from './interface'
export * from './interface'

const QuestionDatePickerConfig = {
  title: '日期选择',
  type: 'QuestionDatePicker',
  Component,
  defaultProps: QuestionDatePickerDefaultProps
}

export default QuestionDatePickerConfig
