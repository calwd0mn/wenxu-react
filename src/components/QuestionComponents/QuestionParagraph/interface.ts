export type QuestionParagraphPropsType = {
  text?: string
  isCenter?: boolean
  color?: string
  strong?: boolean
  onChange?: (value: QuestionParagraphPropsType) => void
  disabled?: boolean
}
export const QuestionParagraphDefaultProps: QuestionParagraphPropsType = {
  text: '段落文本',
  isCenter: false,
  strong: false,
  color: '#333'
}
