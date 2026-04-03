import QuestionTitleConf, { QuestionTitlePropsType } from './QuestionTitle'
import QuestionInputConf, { QuestionInputPropsType } from './QuestionInput'
import QuestionDatePickConf, {
  QuestionDatePickerPropsType
} from './QuestionDatePick'
import QuestionParagraphConf, {
  QuestionParagraphPropsType
} from './QuestionParagraph'
import QuestionInfoConf, { QuestionInfoPropsType } from './QuestionInfo'
import QuestionRadioConf, {
  QuestionRadioPropsType,
  QuestionRadioStatType
} from './QuestionRadio'
import QuestionCheckboxConf, {
  QuestionCheckBoxPropsType,
  QuestionCheckBoxStatType
} from './QuestionCheckobx'
export type ComponentPropsType = QuestionTitlePropsType &
  QuestionInputPropsType &
  QuestionDatePickerPropsType &
  QuestionParagraphPropsType &
  QuestionInfoPropsType &
  QuestionRadioPropsType &
  QuestionCheckBoxPropsType
export type ComponentStatType = QuestionRadioStatType & QuestionCheckBoxStatType
export type ComponentConfType = {
  title: string
  type: string
  Component: React.FC<ComponentPropsType>
  defaultProps: ComponentPropsType
}
const componentsConfList: ComponentConfType[] = [
  QuestionTitleConf,
  QuestionInputConf,
  QuestionDatePickConf,
  QuestionParagraphConf,
  QuestionInfoConf,
  QuestionRadioConf,
  QuestionCheckboxConf
]
export const componentsGroup = [
  {
    groupName: '文本显示',
    components: [QuestionInfoConf, QuestionTitleConf, QuestionParagraphConf]
  },
  {
    groupName: '用户输入',
    components: [QuestionInputConf, QuestionDatePickConf]
  },
  {
    groupName: '用户选择',
    components: [QuestionRadioConf, QuestionCheckboxConf]
  }
]

export type ComponentItem = {
  _id: string
  name: string
  title: string
  type: string
  isHidden?: boolean
  isLock?: boolean
  props: ComponentPropsType
}
export function getComponentConfByType(type: string) {
  return componentsConfList.find(item => item.type === type)
}
