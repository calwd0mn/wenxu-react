import React from 'react'
import style from '../styles/Login.module.scss'
import { Link, useNavigate } from 'react-router-dom'
import type { FormProps } from 'antd'
import { Button, Checkbox, Flex, Form, Input, Space, Typography } from 'antd'
import { HOME_PATH, REGISTER_PATH } from '../roters'
import { systemLoginFun, systemGetUserInfoFun } from '../api/system'
import { setToken } from '../hooks/userUserInfoStore'
import { useRequest } from 'ahooks'
import useUserInfoStore from '../hooks/userUserInfoStore'
import { BRAND_NAME, BRAND_SUBTITLE } from '../constant/brand'

const { Title } = Typography

type FieldType = {
  userName?: string
  passWord?: string
  remember?: string
}

export default function Login() {
  const [form] = Form.useForm()
  const nav = useNavigate()
  const { setInfo } = useUserInfoStore()
  const { run: getUserInfoFun } = useRequest(async () => await systemGetUserInfoFun(), {
    manual: true,
    onSuccess(res) {
      setInfo(res.data)
      nav(HOME_PATH)
    }
  })
  const { run: loginFun, loading: loginLoading } = useRequest(
    async data => await systemLoginFun(data),
    {
      manual: true,
      onSuccess(res) {
        setToken(res.data.token)
        getUserInfoFun()
      }
    }
  )

  const onFinish: FormProps<FieldType>['onFinish'] = values => {
    loginFun(values)
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
            登录 {BRAND_NAME}
          </Title>
          <div className={style['auth-description']}>进入你的问卷工作台，继续创作与分析。</div>
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
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item<FieldType>
            label="密码"
            name="passWord"
            rules={[{ required: true, message: '密码不能为空' }]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>

          <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
            <Checkbox>记住我</Checkbox>
          </Form.Item>

          <Form.Item label={null}>
            <Space>
              <Button loading={loginLoading} type="primary" htmlType="submit">
                登录
              </Button>
              <Link to={REGISTER_PATH}>没有账号，去注册</Link>
            </Space>
          </Form.Item>
        </Form>
      </Flex>
    </div>
  )
}
