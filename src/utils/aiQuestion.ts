import { nanoid } from 'nanoid'
import { ComponentPropsType, getComponentConfByType } from '../components/QuestionComponents'
import { componentInfoType } from '../store/componentsReducer'
import { AiGenerateResponse, AiOptimizeComponentResponse } from '../types/AiType'

type AiComponentDraft = Partial<componentInfoType> & {
  props?: Record<string, any>
}

const DEFAULT_COMPONENT_TITLE: Record<string, string> = {
  QuestionTitle: '标题',
  QuestionInfo: '问卷信息',
  QuestionParagraph: '段落',
  QuestionInput: '输入框',
  QuestionDatePicker: '日期选择',
  QuestionRadio: '单选',
  QuestionCheckbox: '多选'
}

function getDefaultProps(type: string): ComponentPropsType {
  const componentConf = getComponentConfByType(type)
  return (componentConf?.defaultProps || {}) as ComponentPropsType
}

function normalizeCheckboxOptions(props: Record<string, any>) {
  if (Array.isArray(props.options) && props.options.length > 0) {
    props.options = props.options.map((item: any) => ({
      label: String(item?.label ?? item?.value ?? item ?? ''),
      value: String(item?.value ?? item?.label ?? item ?? ''),
      checked: Boolean(item?.checked)
    }))
    return
  }

  if (Array.isArray(props.values) && props.values.length > 0) {
    props.options = props.values.map((item: any) => {
      const text = String(item?.label ?? item?.value ?? item ?? '')
      return { label: text, value: text, checked: false }
    })
  }
}

function normalizeRadioValues(props: Record<string, any>) {
  if (Array.isArray(props.values) && props.values.length > 0) {
    props.values = props.values.map((item: any) =>
      String(item?.label ?? item?.value ?? item ?? '')
    )
    return
  }

  if (Array.isArray(props.options) && props.options.length > 0) {
    props.values = props.options.map((item: any) =>
      String(item?.label ?? item?.value ?? item ?? '')
    )
  }
}

function normalizeSpecialProps(type: string, props: Record<string, any>) {
  if (type === 'QuestionCheckbox') normalizeCheckboxOptions(props)
  if (type === 'QuestionRadio') normalizeRadioValues(props)
  return props
}

function getComponentTitle(type: string, props: Record<string, any>) {
  if (typeof props.title === 'string' && props.title.trim()) return props.title.trim()
  if (type === 'QuestionTitle' && typeof props.text === 'string' && props.text.trim()) {
    return props.text.trim()
  }
  if (type === 'QuestionParagraph' && typeof props.text === 'string' && props.text.trim()) {
    return props.text.trim().slice(0, 20)
  }
  return DEFAULT_COMPONENT_TITLE[type] || type
}

export function normalizeAiComponent(
  component: AiComponentDraft,
  keepId?: string
): componentInfoType | null {
  const type = String(component.type || '')
  const componentConf = getComponentConfByType(type)
  if (!componentConf) return null

  const props = normalizeSpecialProps(type, {
    ...getDefaultProps(type),
    ...(component.props || {})
  })
  const title = String(component.title || getComponentTitle(type, props))

  return {
    _id: keepId || component._id || nanoid(),
    name: String(component.name || `${type}_${nanoid(8)}`),
    title,
    type,
    props,
    isHidden: Boolean(component.isHidden),
    isLock: Boolean(component.isLock)
  }
}

export function normalizeAiQuestionResult(
  result: Partial<AiGenerateResponse>
): AiGenerateResponse {
  const componentsList = Array.isArray(result.componentsList)
    ? result.componentsList
        .map(item => normalizeAiComponent(item))
        .filter(Boolean) as componentInfoType[]
    : []

  return {
    title: result.title || 'AI 生成问卷',
    description: result.description || '',
    componentsList,
    summary: result.summary || ''
  }
}

export function normalizeAiComponentResult(
  result: Partial<AiOptimizeComponentResponse>,
  currentComponent: componentInfoType
): AiOptimizeComponentResponse {
  const component = normalizeAiComponent(result.component || {}, currentComponent._id)

  return {
    component: component || currentComponent,
    summary: result.summary || ''
  }
}

export function renderComponentTitle(component: componentInfoType) {
  return component.title || getComponentTitle(component.type, component.props || {})
}
