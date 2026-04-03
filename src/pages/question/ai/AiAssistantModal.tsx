import React, { useEffect, useMemo, useState } from 'react'
import {
  Alert,
  Button,
  Card,
  Empty,
  Flex,
  Input,
  List,
  Modal,
  Space,
  Spin,
  Typography,
  message
} from 'antd'
import { useDispatch } from 'react-redux'
import useGetComponentInfo from '../../../hooks/useGetComponentInfo'
import useGetPageInfo from '../../../hooks/useGetPageInfo'
import { changeSelectedId, replaceComponentById, replaceComponents } from '../../../store/componentsReducer'
import { resertPageInfo } from '../../../store/pageInfoReducer'
import { generateQuestionByAi, optimizeQuestionComponentByAi } from '../../../api/list'
import { AiChatMessage, AiGenerateResponse, AiOptimizeComponentResponse } from '../../../types/AiType'
import {
  normalizeAiComponentResult,
  normalizeAiQuestionResult,
  renderComponentTitle
} from '../../../utils/aiQuestion'
import { componentInfoType } from '../../../store/componentsReducer'
import { getComponentConfByType } from '../../../components/QuestionComponents'

const { Paragraph, Text, Title } = Typography

export type AiAssistantMode = 'page' | 'component'

type AiAssistantModalProps = {
  open: boolean
  mode: AiAssistantMode
  onClose: () => void
}

function PreviewItem({ component }: { component: componentInfoType }) {
  const componentConf = getComponentConfByType(component.type)
  if (!componentConf) return null

  const { Component } = componentConf

  return (
    <Card size="small" style={{ marginBottom: 12 }}>
      <Text strong>{renderComponentTitle(component)}</Text>
      <div style={{ marginTop: 12 }}>
        <Component {...component.props} />
      </div>
    </Card>
  )
}

function MessageList({ messages }: { messages: AiChatMessage[] }) {
  if (messages.length === 0) {
    return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="先告诉 AI 你想做什么问卷" />
  }

  return (
    <List
      size="small"
      dataSource={messages}
      renderItem={item => (
        <List.Item>
          <div style={{ width: '100%' }}>
            <Text strong>{item.role === 'user' ? '你' : 'AI'}</Text>
            <Paragraph style={{ marginBottom: 0, marginTop: 4, whiteSpace: 'pre-wrap' }}>
              {item.content}
            </Paragraph>
          </div>
        </List.Item>
      )}
    />
  )
}

export default function AiAssistantModal({
  open,
  mode,
  onClose
}: AiAssistantModalProps) {
  const dispatch = useDispatch()
  const pageInfo = useGetPageInfo()
  const { componentsList, selectedComponent } = useGetComponentInfo()

  const [messages, setMessages] = useState<AiChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draftResult, setDraftResult] = useState<
    AiGenerateResponse | AiOptimizeComponentResponse | null
  >(null)

  useEffect(() => {
    if (!open) {
      setMessages([])
      setInputValue('')
      setLoading(false)
      setError('')
      setDraftResult(null)
    }
  }, [open, mode])

  const isComponentModeDisabled = mode === 'component' && !selectedComponent
  const modalTitle = mode === 'page' ? 'AI 助手生成问卷' : 'AI 优化当前题目'

  const currentPreview = useMemo(() => {
    if (mode === 'component') return selectedComponent ? [selectedComponent] : []
    return componentsList
  }, [componentsList, mode, selectedComponent])

  const draftPreview = useMemo(() => {
    if (!draftResult) return []
    if (mode === 'component') {
      return [(draftResult as AiOptimizeComponentResponse).component]
    }
    return (draftResult as AiGenerateResponse).componentsList
  }, [draftResult, mode])

  async function handleGenerate(nextMessages: AiChatMessage[]) {
    setLoading(true)
    setError('')

    try {
      if (mode === 'component') {
        if (!selectedComponent) throw new Error('请先选中一个题目再进行 AI 优化')
        const res = await optimizeQuestionComponentByAi({
          messages: nextMessages,
          currentComponent: selectedComponent,
          pageTitle: pageInfo.title,
          pageDescription: pageInfo.description
        })
        const normalized = normalizeAiComponentResult(res.data, selectedComponent)
        setDraftResult(normalized)
        setMessages([...nextMessages, { role: 'assistant', content: normalized.summary || '已生成优化结果' }])
        return
      }

      const res = await generateQuestionByAi({
        messages: nextMessages,
        currentPageInfo: pageInfo,
        currentComponentsList: componentsList
      })
      const normalized = normalizeAiQuestionResult(res.data)
      setDraftResult(normalized)
      setMessages([...nextMessages, { role: 'assistant', content: normalized.summary || '已生成问卷草稿' }])
    } catch (err: any) {
      setError(err.message || 'AI 生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit() {
    const content = inputValue.trim()
    if (!content || loading) return

    const nextMessages: AiChatMessage[] = [...messages, { role: 'user', content }]
    setInputValue('')
    await handleGenerate(nextMessages)
  }

  async function handleRegenerate() {
    const nextMessages = messages.filter(item => item.role === 'user') as AiChatMessage[]
    if (nextMessages.length === 0 || loading) return
    await handleGenerate(nextMessages)
  }

  function handleApply() {
    if (!draftResult) return

    if (mode === 'component') {
      const result = draftResult as AiOptimizeComponentResponse
      dispatch(
        replaceComponentById({
          _id: result.component._id,
          component: {
            type: result.component.type,
            title: result.component.title,
            name: result.component.name,
            props: result.component.props,
            isHidden: result.component.isHidden,
            isLock: result.component.isLock
          }
        })
      )
      dispatch(changeSelectedId(result.component._id))
      message.success('已应用 AI 优化结果')
      onClose()
      return
    }

    const result = draftResult as AiGenerateResponse
    dispatch(
      resertPageInfo({
        ...pageInfo,
        title: result.title,
        description: result.description || '',
        publish: pageInfo.publish,
        star: pageInfo.star,
        jsCode: pageInfo.jsCode || '',
        cssCode: pageInfo.cssCode || ''
      })
    )
    dispatch(replaceComponents(result.componentsList))
    if (result.componentsList[0]?._id) {
      dispatch(changeSelectedId(result.componentsList[0]._id))
    }
    message.success('已将 AI 结果填充到画布')
    onClose()
  }

  return (
    <Modal title={modalTitle} open={open} onCancel={onClose} width={1200} footer={null} destroyOnClose>
      {isComponentModeDisabled ? (
        <Alert type="warning" showIcon message="请先在画布中选中一个题目，再打开 AI 优化。" />
      ) : (
        <Flex vertical gap={16}>
          <Flex gap={16} align="stretch">
            <Card title="当前内容" style={{ flex: 1, minHeight: 360 }}>
              {mode === 'page' ? (
                <>
                  <Title level={5} style={{ marginTop: 0 }}>
                    {pageInfo.title}
                  </Title>
                  <Paragraph type="secondary">{pageInfo.description || '暂无描述'}</Paragraph>
                </>
              ) : null}
              {currentPreview.length > 0 ? (
                currentPreview.map(item => <PreviewItem key={item._id} component={item} />)
              ) : (
                <Empty description={mode === 'page' ? '当前画布为空' : '未选择组件'} />
              )}
            </Card>
            <Card title="AI 生成结果" style={{ flex: 1, minHeight: 360 }}>
              {loading ? (
                <Flex justify="center" align="center" style={{ minHeight: 240 }}>
                  <Spin />
                </Flex>
              ) : draftResult ? (
                <>
                  {mode === 'page' ? (
                    <>
                      <Title level={5} style={{ marginTop: 0 }}>
                        {(draftResult as AiGenerateResponse).title}
                      </Title>
                      <Paragraph type="secondary">
                        {(draftResult as AiGenerateResponse).description || '暂无描述'}
                      </Paragraph>
                    </>
                  ) : null}
                  {draftPreview.map(item => (
                    <PreviewItem key={item._id} component={item} />
                  ))}
                </>
              ) : (
                <Empty description="AI 结果会展示在这里" />
              )}
            </Card>
          </Flex>

          <Card title="对话记录">
            <MessageList messages={messages} />
            {error ? <Alert style={{ marginTop: 12 }} type="error" showIcon message={error} /> : null}
            <Input.TextArea
              rows={4}
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
              placeholder={
                mode === 'page'
                  ? '例如：帮我生成一份用于活动报名的问卷，包含基本信息、到场时间和餐饮偏好'
                  : '例如：把这个问题改得更专业一些，并且让选项更完整'
              }
              style={{ marginTop: 12 }}
            />
            <Flex justify="space-between" align="center" style={{ marginTop: 12 }}>
              <Text type="secondary">
                {mode === 'page'
                  ? 'AI 会根据当前问卷上下文生成整页草稿。'
                  : 'AI 会基于当前选中题目生成优化版本。'}
              </Text>
              <Space>
                <Button onClick={handleRegenerate} disabled={loading || messages.length === 0}>
                  重新生成
                </Button>
                <Button type="primary" onClick={handleSubmit} loading={loading}>
                  继续交流
                </Button>
              </Space>
            </Flex>
          </Card>

          <Flex justify="end" gap={8}>
            <Button onClick={onClose}>取消</Button>
            <Button type="primary" onClick={handleApply} disabled={!draftResult || loading}>
              应用结果
            </Button>
          </Flex>
        </Flex>
      )}
    </Modal>
  )
}
