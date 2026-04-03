import React from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import style from './MainLayout.module.scss'
import { Layout, Button, Space, Popover, Flex } from 'antd'
import { CompassOutlined } from '@ant-design/icons'
import { LOGIN_PATH } from '../roters'
import useUserInfoStore, { loginOut } from '../hooks/userUserInfoStore'
import { BRAND_NAME, BRAND_SUBTITLE } from '../constant/brand'

const { Header, Content, Footer } = Layout

export default function MainLayout() {
  const navigate = useNavigate()
  const { userName } = useUserInfoStore()

  const goHome = () => {
    navigate('/')
  }

  const goLogin = () => {
    navigate({
      pathname: LOGIN_PATH,
      search: 'a=1&b=2'
    })
  }

  const RightNameCompon = () => {
    return userName ? (
      <Popover
        trigger={'click'}
        content={
          <Flex gap="middle" vertical>
            <Button type="text">修改密码</Button>
            <Button type="text" onClick={loginOut}>
              退出登录
            </Button>
          </Flex>
        }
      >
        <b>欢迎你：{userName}</b>
      </Popover>
    ) : (
      <Button onClick={goLogin}>登录</Button>
    )
  }

  return (
    <Layout>
      <Header className={style.header}>
        <div className={style.brand} onClick={goHome}>
          <div className={style.brandMark}>
            <CompassOutlined />
          </div>
          <div className={style.brandText}>
            <h1>{BRAND_NAME}</h1>
            <div className={style.brandSubtitle}>{BRAND_SUBTITLE}</div>
          </div>
        </div>
        <div className={style.headerAction}>
          <RightNameCompon />
        </div>
      </Header>

      <Content className={style.container}>
        <Outlet />
      </Content>

      <Footer className={style.footer}>
        {BRAND_NAME} ©{new Date().getFullYear()} Survey Studio
      </Footer>
    </Layout>
  )
}
