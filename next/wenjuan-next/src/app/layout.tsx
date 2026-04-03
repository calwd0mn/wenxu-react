import React, { ReactNode } from 'react'
import type { Metadata } from 'next'
import './globals.css'
import { AntdRegistry } from '@ant-design/nextjs-registry'
import withTheme from '@/theme/index'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import 'dayjs/locale/zh-cn'
import dayjs from 'dayjs'
dayjs.locale('zh-cn')

export const metadata: Metadata = {
  title: '问序',
  description: '问序 - AI驱动的智能问卷构建平台'
}

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body>
        {withTheme(
          <AntdRegistry>
            <ConfigProvider locale={zhCN}>
              {children}
            </ConfigProvider>
          </AntdRegistry>
        )}
      </body>
    </html>
  )
}
