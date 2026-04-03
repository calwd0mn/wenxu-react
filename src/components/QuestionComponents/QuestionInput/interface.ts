export type QuestionInputPropsType = {
  title?: string
  placeholder?: string
  inputType?: 'text' | 'textArea'
  textAreaRows?: number
  onChange?: (value: QuestionInputPropsType) => void
  disabled?: boolean
}

export const QuestionInputDefaultProps: QuestionInputPropsType = {
  title: '输入框标题',
  placeholder: '请输入内容',
  inputType: 'text',
  textAreaRows: 3
}
