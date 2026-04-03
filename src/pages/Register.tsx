import React from 'react'
import style from '../styles/Login.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import type { FormProps } from 'antd'
import { Button, Flex, Form, Input, message, Space, Typography } from 'antd'
import { LOGIN_PATH } from '../roters'
import { useRequest } from 'ahooks'
import { systemRegisterFun } from '../api/system'
import { BRAND_NAME, BRAND_SUBTITLE } from '../constant/brand'
const { Title } = Typography

type FieldType = {
  userName?: string
  passWord?: string
  confirmPassword?: string
}

export default function Login() {
  const [form] = Form.useForm()
  const nav = useNavigate()

  const { run: registerFun, loading: registerLoading } = useRequest(
    async data => await systemRegisterFun(data),
    {
      manual: true,
      onSuccess(res) {
        message.success(res.message)
        nav(LOGIN_PATH)
      }
    }
  )

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    registerFun(values)
  }

  return (
    <div className={style['login-container']}>
      <Flex
        vertical
        justify="center"
        className={style['auth-card']}
      >
        <Flex justify="center">
          <div className={style['brand-chip']}>{BRAND_SUBTITLE}</div>
        </Flex>
        <Flex justify="center" vertical className={style['auth-title']}>
          <Title level={2} style={{ marginBottom: 0 }}>
            注册 {BRAND_NAME}
          </Title>
          <div className={style['auth-description']}>创建一个账号，开始搭建更聪明的问卷流程。</div>
        </Flex>
        <Form
          name="basic"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
          form={form}
          style={{ marginTop: 20 }}
        >
          <Form.Item<FieldType>
            label="用户名"
            name="userName"
            rules={[
              { required: true, message: '请输入用户名' },
              { min: 5, max: 20, message: '请输入5-20位字符' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="passWord"
            rules={[
              { required: true, message: '密码不能为空' },
              { pattern: /^[a-zA-Z0-9]{6,20}$/, message: '请输入6-20位字母、数字' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item<FieldType>
            label="确认密码"
            name="confirmPassword"
            dependencies={['passWord']}
            rules={[
              { required: true, message: '密码不能为空' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('passWord') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('两次密码不一致'))
                }
              })
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item label={null}>
            <Space style={{ marginTop: '15px' }}>
              <Button loading={registerLoading} type="primary" htmlType="submit">
                立即注册
              </Button>
              <Link to={LOGIN_PATH}>已有账号，去登录</Link>
            </Space>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  )
}
