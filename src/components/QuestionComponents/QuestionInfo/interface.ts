export type QuestionInfoPropsType = {
  title?: string
  titleLevel?: 1 | 2 | 3 | 4 | 5
  titleIsCenter?: boolean
  titleColor?: string
  text?: string
  textIsCenter?: boolean
  textColor?: string
  textStrong?: boolean
  textMarginTop?: number
  onChange?: (value: QuestionInfoPropsType) => void
  disabled?: boolean
}
export const QuestionInfoDefaultProps: QuestionInfoPropsType = {
  title: '一行标题',
  titleLevel: 1,
  titleIsCenter: true,
  titleColor: '#000000',

  text: '段落文本',
  textIsCenter: true,
  textColor: '#000000',
  textStrong: false,
  textMarginTop: 10
}
