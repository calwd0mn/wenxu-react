import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import style from './ManageLayout.module.scss'
import { Button, Space, Divider } from 'antd'
import {
  PlusOutlined,
  UnorderedListOutlined,
  DeleteOutlined,
  StarOutlined
} from '@ant-design/icons'
import { LIST_PATH, STAR_PATH, TRASH_PATH } from '../roters'

export default function ManageLayout() {
  const { pathname } = useLocation()
  const nav = useNavigate()
  const addQuestion = () => {
    nav(`/question/add`)
  }

  return (
    <div className={style.container}>
      <div className={style.left}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          style={{ marginTop: '26px' }}
          onClick={addQuestion}
        >
          创建问卷
        </Button>
        <Divider></Divider>
        <Space direction="vertical" size="large">
          <Button
            type={pathname === LIST_PATH ? 'primary' : 'default'}
            icon={<UnorderedListOutlined />}
            onClick={() => nav(LIST_PATH)}
          >
            我的问卷
          </Button>
          <Button
            type={pathname === STAR_PATH ? 'primary' : 'default'}
            icon={<StarOutlined />}
            onClick={() => nav(STAR_PATH)}
          >
            星标问卷
          </Button>
          <Button
            type={pathname === TRASH_PATH ? 'primary' : 'default'}
            icon={<DeleteOutlined />}
            onClick={() => nav(TRASH_PATH)}
          >
            回收站
          </Button>
        </Space>
      </div>
      <div className={style.right}>
        <Outlet></Outlet>
      </div>
    </div>
  )
}
