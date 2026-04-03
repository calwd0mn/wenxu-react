import Component from './Component'
import PropComponent from './PropComponent'
import { QuestionDatePickerDefaultProps } from './interface'
export * from './interface'

export default {
  title: '日期选择',
  type: 'QuestionDatePicker',
  Component,
  PropComponent,
  defaultProps: QuestionDatePickerDefaultProps
}
