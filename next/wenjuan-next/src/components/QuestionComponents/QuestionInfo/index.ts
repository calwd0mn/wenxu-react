import Component from './Component'
import { QuestionInfoDefaultProps } from './interface'
export * from './interface'

const questionInfoConfig = {
  title: '问卷信息',
  type: 'QuestionInfo',
  Component,
  defaultProps: QuestionInfoDefaultProps
};

export default questionInfoConfig;
