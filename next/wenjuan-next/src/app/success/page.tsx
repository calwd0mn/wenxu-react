'use client'
import React from 'react'
import { Result, Button, Space } from 'antd'
import { useRouter } from 'next/navigation'
import styles from './Success.module.css'

export default function SuccessPage() {
  const router = useRouter()

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <Result
          status="success"
          title="提交成功"
          subTitle="感谢您的参与，您的反馈对我们非常重要"
          extra={
            <Space wrap>
              <Button onClick={() => router.back()}>返回</Button>
            </Space>
          }
          style={{
            padding: 0,
            margin: 0
          }}
        />
      </div>
    </div>
  )
}
