import Component from './Component'
import { QuestionInputDefaultProps } from './interface'
export * from './interface'

const QuestionInputConfig = {
  title: '输入框',
  type: 'QuestionInput',
  Component,
  defaultProps: QuestionInputDefaultProps
};

export default QuestionInputConfig;
