import Component from './Component'
import PropComponent from './PropComponent'
import { QuestionInfoDefaultProps } from './interface'
export * from './interface'

export default {
  title: '问卷信息',
  type: 'QuestionInfo',
  Component,
  PropComponent,
  defaultProps: QuestionInfoDefaultProps
}
