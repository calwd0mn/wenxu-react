export type QuestionCheckItemPropsType = {
  label: string
  value: string
  checked: boolean
}

export type QuestionCheckBoxPropsType = {
  componentId?: string
  name?: string
  title?: string
  options?: Array<QuestionCheckItemPropsType>
  values?: Array<string>
  layout?: 'horizontal' | 'vertical'
  onChange?: (value: string) => void
  disabled?: boolean
}
export const QuestionCheckboxDefaultProps: QuestionCheckBoxPropsType = {
  title: '多选',
  options: [
    { label: '选项1', value: '选项1', checked: false },
    { label: '选项2', value: '选项2', checked: false },
    { label: '选项3', value: '选项3', checked: true }
  ],
  layout: 'horizontal'
}

export type QuestionCheckBoxStatType = {
  stat: Array<{
    value: string
    count: number
  }>
}
