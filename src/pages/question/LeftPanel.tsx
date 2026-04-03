import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons'
import { Space, Tabs } from 'antd'
import React from 'react'
import ComponentLib from './ComponentLib'
import Layerlib from './Layerlib'

export default function LeftPanel() {
  const tabsItems = [
    {
      key: 'componentsLab',
      label: (
        <Space>
          <AppstoreOutlined />
          <span>组件库</span>
        </Space>
      ),
      children: <ComponentLib />
    },
    {
      key: 'layers',
      label: (
        <Space>
          <BarsOutlined />
          <span>图层</span>
        </Space>
      ),
      children: <Layerlib />
    }
  ]
  return (
    <div style={{ padding: '10px 16px 16px' }}>
      <Tabs defaultActiveKey="1" items={tabsItems} />
    </div>
  )
}
