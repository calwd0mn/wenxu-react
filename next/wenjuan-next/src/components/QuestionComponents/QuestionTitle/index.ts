import Component from './Component'
import { QuestionTitleDefaultProps } from './interface'
export * from './interface'

const QuestionTitleConfig = {
  title: '标题',
  type: 'QuestionTitle',
  Component,
  defaultProps: QuestionTitleDefaultProps
};

export default QuestionTitleConfig;
