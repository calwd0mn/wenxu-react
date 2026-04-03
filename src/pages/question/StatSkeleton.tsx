import React from 'react'
import { Flex, Spin } from 'antd'
const contentStyle: React.CSSProperties = {
  padding: 50,
  background: 'rgba(0, 0, 0, 0.5)',
  borderRadius: 4
}

const content = <div style={contentStyle} />

export default function StatSkeleton() {
  return (
    <Flex justify="center" align="center" style={{ height: '100vh' }}>
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    </Flex>
  )
}
