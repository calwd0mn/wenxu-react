export type QuestionDatePickerPropsType = {
  title?: string
  placeholder?: string
  type?: 'date' | 'datetime' | 'month' | 'time' | 'week'
  format?: string
  onChange?: (value: QuestionDatePickerPropsType) => void
  disabled?: boolean
}
export const QuestionDatePickerDefaultProps: QuestionDatePickerPropsType = {
  title: '日期选择',
  placeholder: '请选择日期',
  type: 'date',
  format: 'YYYY-MM-DD'
}
