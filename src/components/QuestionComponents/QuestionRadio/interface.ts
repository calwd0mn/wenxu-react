export type QuestionRadioPropsType = {
  title?: string
  values?: Array<string>
  layout?: 'horizontal' | 'vertical'
  defaultValue?: string
  onChange?: (value: QuestionRadioPropsType) => void
  disabled?: boolean
}
export const QuestionRadioDefaultProps: QuestionRadioPropsType = {
  title: '单选',
  values: ['选项1', '选项2', '选项3'],
  layout: 'horizontal',
  defaultValue: ''
}
export type QuestionRadioStatType = {
  stat: Array<{
    value: string
    count: number
  }>
}
