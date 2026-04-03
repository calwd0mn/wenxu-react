export type AiChatMessageDto = {
  role: 'user' | 'assistant'
  content: string
}

export class GenerateQuestionDto {
  readonly messages: AiChatMessageDto[]
  readonly currentPageInfo: Record<string, any>
  readonly currentComponentsList: Record<string, any>[]
}

export class OptimizeComponentDto {
  readonly messages: AiChatMessageDto[]
  readonly currentComponent: Record<string, any>
  readonly pageTitle: string
  readonly pageDescription?: string
}

export class AiQuestionResultDto {
  readonly title: string
  readonly description?: string
  readonly summary?: string
  readonly componentsList: Record<string, any>[]
}

export class AiComponentResultDto {
  readonly summary?: string
  readonly component: Record<string, any>
}
