import React from 'react'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { ComponentPropsType, getComponentConfByType } from '../../components/QuestionComponents'
import { Button, Empty, Flex, Space } from 'antd'

import { useDispatch } from 'react-redux'
import { updateComponentProps } from '../../store/componentsReducer'

function NoProp() {
  return (
    <Flex justify="center">
      <Empty description="未选择组件" />
    </Flex>
  )
}

type PropComponentLibProps = {
  onOpenAiOptimize: () => void
}

export default function PropComponentLib({ onOpenAiOptimize }: PropComponentLibProps) {
  const dispatch = useDispatch()
  const { selectedComponent } = useGetComponentInfo()
  if (!selectedComponent) return <NoProp />

  const { _id, type, props, isLock } = selectedComponent
  const componentConf = getComponentConfByType(type)
  if (!componentConf) return <NoProp />

  function chagneComponentProps(newProps: ComponentPropsType) {
    dispatch(
      updateComponentProps({
        _id,
        newProps
      })
    )
  }

  const { PropComponent } = componentConf

  return (
    <div style={{ paddingBottom: '30px' }}>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" ghost onClick={onOpenAiOptimize}>
          AI 优化当前题目
        </Button>
      </Space>
      <PropComponent {...props} onChange={chagneComponentProps} disabled={isLock} />
    </div>
  )
}
