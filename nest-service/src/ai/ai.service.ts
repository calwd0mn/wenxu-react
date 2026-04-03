import { Injectable } from '@nestjs/common'
import {
  AiChatMessageDto,
  AiComponentResultDto,
  AiQuestionResultDto
} from './dto/ai-question.dto'

type ComponentTemplate = {
  title: string
  type: string
  defaultProps: Record<string, any>
}

const COMPONENT_TEMPLATES: ComponentTemplate[] = [
  {
    title: '标题',
    type: 'QuestionTitle',
    defaultProps: { text: '一行标题', level: 1, isCenter: false, color: '#333' }
  },
  {
    title: '问卷信息',
    type: 'QuestionInfo',
    defaultProps: {
      title: '一行标题',
      titleLevel: 1,
      titleIsCenter: true,
      titleColor: '#000000',
      text: '段落文本',
      textIsCenter: true,
      textColor: '#000000',
      textStrong: false,
      textMarginTop: 10
    }
  },
  {
    title: '段落',
    type: 'QuestionParagraph',
    defaultProps: { text: '段落文本', isCenter: false, strong: false, color: '#333' }
  },
  {
    title: '输入框',
    type: 'QuestionInput',
    defaultProps: {
      title: '输入框标题',
      placeholder: '请输入内容',
      inputType: 'text',
      textAreaRows: 3
    }
  },
  {
    title: '日期选择',
    type: 'QuestionDatePicker',
    defaultProps: {
      title: '日期选择',
      placeholder: '请选择日期',
      type: 'date',
      format: 'YYYY-MM-DD'
    }
  },
  {
    title: '单选',
    type: 'QuestionRadio',
    defaultProps: {
      title: '单选',
      values: ['选项1', '选项2', '选项3'],
      layout: 'horizontal',
      defaultValue: ''
    }
  },
  {
    title: '多选',
    type: 'QuestionCheckbox',
    defaultProps: {
      title: '多选',
      options: [
        { label: '选项1', value: '选项1', checked: false },
        { label: '选项2', value: '选项2', checked: false },
        { label: '选项3', value: '选项3', checked: false }
      ],
      layout: 'horizontal'
    }
  }
]

function getTemplateByType(type: string) {
  return COMPONENT_TEMPLATES.find(item => item.type === type)
}

@Injectable()
export class AiService {
  async generateQuestion(
    messages: AiChatMessageDto[],
    currentPageInfo: Record<string, any>,
    currentComponentsList: Record<string, any>[]
  ): Promise<AiQuestionResultDto> {
    const payload = await this.callModel(
      this.buildSystemPrompt('page'),
      this.buildPageUserPrompt(messages, currentPageInfo, currentComponentsList)
    )

    return this.normalizeQuestionResult(payload)
  }

  async optimizeComponent(
    messages: AiChatMessageDto[],
    currentComponent: Record<string, any>,
    pageTitle: string,
    pageDescription?: string
  ): Promise<AiComponentResultDto> {
    const payload = await this.callModel(
      this.buildSystemPrompt('component'),
      this.buildComponentUserPrompt(messages, currentComponent, pageTitle, pageDescription)
    )

    return this.normalizeComponentResult(payload)
  }

  private buildSystemPrompt(mode: 'page' | 'component') {
    const componentSpec = COMPONENT_TEMPLATES.map(item => ({
      title: item.title,
      type: item.type,
      defaultProps: item.defaultProps
    }))

    return [
      '你是一个问卷编辑器的结构化内容生成助手。',
      '你只能输出 JSON，不能输出 markdown、解释、代码块或额外说明。',
      `当前模式：${mode === 'page' ? '整页生成' : '单题优化'}。`,
      '只允许使用以下组件类型：',
      JSON.stringify(componentSpec)
    ].join('\n')
  }

  private buildPageUserPrompt(
    messages: AiChatMessageDto[],
    currentPageInfo: Record<string, any>,
    currentComponentsList: Record<string, any>[]
  ) {
    return JSON.stringify({
      task: '根据对话生成完整问卷',
      conversation: messages,
      currentPageInfo,
      currentComponentsList,
      outputShape: {
        title: 'string',
        description: 'string',
        summary: 'string',
        componentsList: [
          {
            title: 'string',
            type: 'QuestionTitle|QuestionInfo|QuestionParagraph|QuestionInput|QuestionDatePicker|QuestionRadio|QuestionCheckbox',
            props: {}
          }
        ]
      }
    })
  }

  private buildComponentUserPrompt(
    messages: AiChatMessageDto[],
    currentComponent: Record<string, any>,
    pageTitle: string,
    pageDescription?: string
  ) {
    return JSON.stringify({
      task: '根据对话优化单个问卷组件',
      conversation: messages,
      pageTitle,
      pageDescription,
      currentComponent,
      outputShape: {
        summary: 'string',
        component: {
          title: 'string',
          type: 'QuestionTitle|QuestionInfo|QuestionParagraph|QuestionInput|QuestionDatePicker|QuestionRadio|QuestionCheckbox',
          props: {}
        }
      }
    })
  }

  private async callModel(systemPrompt: string, userPrompt: string) {
    const apiKey = process.env.AI_API_KEY
    const baseUrl = process.env.AI_BASE_URL
    const model = process.env.AI_MODEL
    const timeout = Number(process.env.AI_TIMEOUT || 30000)

    if (!apiKey || !baseUrl || !model) {
      throw new Error('AI 配置不完整，请检查 AI_API_KEY、AI_BASE_URL、AI_MODEL')
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)
    const endpoint = `${baseUrl.replace(/\/$/, '')}/chat/completions`

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          temperature: 0.3,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ]
        }),
        signal: controller.signal
      })

      if (!response.ok) {
        const text = await response.text()
        throw new Error(`AI 服务请求失败: ${text || response.statusText}`)
      }

      const data = (await response.json()) as any
      const content = data?.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('AI 未返回有效内容')
      }

      return this.parseJson(content)
    } finally {
      clearTimeout(timer)
    }
  }

  private parseJson(rawContent: string) {
    const content = rawContent.trim()
    const fencedMatch = content.match(/```(?:json)?\s*([\s\S]*?)```/i)
    const jsonText = fencedMatch?.[1]?.trim() || content

    try {
      return JSON.parse(jsonText)
    } catch {
      const startIndex = jsonText.indexOf('{')
      const endIndex = jsonText.lastIndexOf('}')
      if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
        throw new Error('AI 返回的内容不是合法 JSON')
      }

      try {
        return JSON.parse(jsonText.slice(startIndex, endIndex + 1))
      } catch {
        throw new Error('AI 返回的 JSON 解析失败')
      }
    }
  }

  private normalizeQuestionResult(payload: any): AiQuestionResultDto {
    const componentsList = Array.isArray(payload?.componentsList)
      ? payload.componentsList
          .map((item: any) => this.normalizeComponent(item))
          .filter(Boolean)
      : []

    return {
      title: String(payload?.title || 'AI 生成问卷'),
      description: String(payload?.description || ''),
      summary: String(payload?.summary || '我已经生成了一版问卷草稿，你可以先对比后再应用。'),
      componentsList
    }
  }

  private normalizeComponentResult(payload: any): AiComponentResultDto {
    const component = this.normalizeComponent(payload?.component || {})
    if (!component) {
      throw new Error('AI 返回的组件类型无效')
    }

    return {
      summary: String(payload?.summary || '我已经生成了一版当前题目的优化结果。'),
      component
    }
  }

  private normalizeComponent(component: Record<string, any>) {
    const type = String(component?.type || '')
    const template = getTemplateByType(type)
    if (!template) return null

    const props = this.normalizeProps(type, {
      ...template.defaultProps,
      ...(component?.props || {})
    })
    const title = String(component?.title || props?.title || template.title)

    return {
      title,
      type,
      props
    }
  }

  private normalizeProps(type: string, props: Record<string, any>) {
    if (type === 'QuestionRadio') {
      if (!Array.isArray(props.values) && Array.isArray(props.options)) {
        props.values = props.options.map((item: any) =>
          String(item?.label ?? item?.value ?? item ?? '')
        )
      }
      if (Array.isArray(props.values)) {
        props.values = props.values.map((item: any) =>
          String(item?.label ?? item?.value ?? item ?? '')
        )
      }
    }

    if (type === 'QuestionCheckbox') {
      if (!Array.isArray(props.options) && Array.isArray(props.values)) {
        props.options = props.values.map((item: any) => {
          const text = String(item?.label ?? item?.value ?? item ?? '')
          return { label: text, value: text, checked: false }
        })
      }

      if (Array.isArray(props.options)) {
        props.options = props.options.map((item: any) => ({
          label: String(item?.label ?? item?.value ?? item ?? ''),
          value: String(item?.value ?? item?.label ?? item ?? ''),
          checked: Boolean(item?.checked)
        }))
      }
    }

    return props
  }
}
