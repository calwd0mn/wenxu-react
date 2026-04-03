export type QuestionDatePickerPropsType = {
  componentId?: string
  name?: string
  title?: string
  placeholder?: string
  type?: 'date' | 'week' | 'month' | 'quarter' | 'year'
  format?: string
  onChange?: (value: string) => void
  disabled?: boolean
}
export const QuestionDatePickerDefaultProps: QuestionDatePickerPropsType = {
  title: '日期选择',
  placeholder: '请选择日期',
  type: 'date',
  format: 'YYYY-MM-DD'
}
