import { componentInfoType } from '../store/componentsReducer'
import { PageInfoPropsType } from '../store/pageInfoReducer'

export type AiChatRole = 'user' | 'assistant'

export type AiChatMessage = {
  role: AiChatRole
  content: string
}

export type AiGenerateRequest = {
  messages: AiChatMessage[]
  currentPageInfo: PageInfoPropsType
  currentComponentsList: componentInfoType[]
}

export type AiGenerateResponse = {
  title: string
  description?: string
  componentsList: componentInfoType[]
  summary?: string
}

export type AiOptimizeComponentRequest = {
  messages: AiChatMessage[]
  currentComponent: componentInfoType
  pageTitle: string
  pageDescription?: string
}

export type AiOptimizeComponentResponse = {
  component: componentInfoType
  summary?: string
}
