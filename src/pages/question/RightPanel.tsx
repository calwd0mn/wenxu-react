import { FileTextOutlined, SettingOutlined } from '@ant-design/icons'
import { Space, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import PropComponentLib from './PropComponentLib'
import style from './RightPanel.module.scss'
import PageSetting from './PageSetting'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'

enum TAB_KEY {
  PROPS_KEY = 'props',
  SETTING_KEY = 'setting'
}

type RightPanelProps = {
  onOpenAiOptimize: () => void
}

export default function RightPanel({ onOpenAiOptimize }: RightPanelProps) {
  const [activeKey, setActiveKey] = useState(TAB_KEY.PROPS_KEY)
  const { selectedId } = useGetComponentInfo()

  useEffect(() => {
    if (selectedId) {
      setActiveKey(TAB_KEY.PROPS_KEY)
    } else {
      setActiveKey(TAB_KEY.SETTING_KEY)
    }
  }, [selectedId])

  const tabsItems = [
    {
      key: TAB_KEY.PROPS_KEY,
      label: (
        <Space>
          <FileTextOutlined />
          <span>属性</span>
        </Space>
      ),
      children: <PropComponentLib onOpenAiOptimize={onOpenAiOptimize} />
    },
    {
      key: TAB_KEY.SETTING_KEY,
      label: (
        <Space>
          <SettingOutlined />
          <span>页面设置</span>
        </Space>
      ),
      children: <PageSetting />
    }
  ]
  return (
    <div className={style.rightPanel}>
      <Tabs
        activeKey={activeKey}
        items={tabsItems}
        onChange={key => setActiveKey(key as TAB_KEY)}
      />
    </div>
  )
}
