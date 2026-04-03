import React from 'react'
import { ConfigProvider } from 'antd'
import 'dayjs/locale/zh-cn'
import zh_CN from 'antd/es/locale/zh_CN'

const withTheme = (node: React.ReactNode) => (
  <>
    <ConfigProvider
      locale={zh_CN}
      theme={{
        token: {
          fontSize: 16
        }
      }}
    >
      {node}
    </ConfigProvider>
  </>
)

export default withTheme
