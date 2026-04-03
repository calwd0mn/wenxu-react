import Component from './Component'
import { QuestionParagraphDefaultProps } from './interface'
export * from './interface'

const QuestionParagraphConfig = {
  title: '段落',
  type: 'QuestionParagraph',
  Component,
  defaultProps: QuestionParagraphDefaultProps
};

export default QuestionParagraphConfig;
