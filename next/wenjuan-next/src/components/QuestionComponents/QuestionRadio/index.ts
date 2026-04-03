import Component from './Component'
import { QuestionRadioDefaultProps } from './interface'
export * from './interface'

const QuestionRadioConfig = {
  title: '单选',
  type: 'QuestionRadio',
  Component,
  defaultProps: QuestionRadioDefaultProps
};

export default QuestionRadioConfig;
