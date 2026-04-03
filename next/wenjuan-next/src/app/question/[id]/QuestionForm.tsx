'use client'
import React from 'react'
import { Button, Form, FormInstance, message } from 'antd'
import {
  ComponentItem,
  getComponentConfByType
} from '@/components/QuestionComponents'
import styles from './QuestionForm.module.css'
import { useRouter } from 'next/navigation'

type QuestionFormProps = {
  componentsList: ComponentItem[]
  questionId: string
}

export default function QuestionForm({
  componentsList,
  questionId
}: QuestionFormProps) {
  const [form] = Form.useForm()
  const router = useRouter()

  const genComponent = (item: ComponentItem, form: FormInstance) => {
    const { type, props } = item
    const { Component } = getComponentConfByType(type) || {}
    if (!Component) {
      return <div>组件不存在</div>
    }
    const componentProp = {
      ...props,
      componentId: item._id,
      name: item.name
    }

    function valueChange(value: string) {
      form.setFieldValue(item._id, value)
    }

    return <Component {...componentProp} onChange={valueChange} />
  }

  return (
    <div className={styles.formContainer}>
      <Form
        form={form}
        className={styles.form}
        onFinish={async () => {
          try {
            const response = await fetch('/api/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                questionId,
                answers: form.getFieldsValue()
              })
            })

            const data = await response.json()

            if (response.ok) {
              message.success('提交成功')
              router.push('/success')
            } else {
              message.error(data.error || '提交失败')
            }
          } catch {
            message.error('提交出错')
          }
        }}
      >
        <div className={styles.formContent}>
          {componentsList
            .filter(item => !item.isHidden)
            .map((item: ComponentItem) => {
              return (
                <Form.Item
                  key={item._id}
                  name={item.name}
                  className={item.isLock ? styles.locked : ''}
                >
                  {genComponent(item, form)}
                </Form.Item>
              )
            })}
        </div>

        <div className={styles.submitButton}>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ height: '40px' }}
          >
            提交
          </Button>
        </div>
      </Form>
    </div>
  )
}
