import React, { FC } from 'react'
import style from './question.module.scss'
import type { PopconfirmProps } from 'antd'
import { Link, useNavigate } from 'react-router-dom'
import { Divider, Space, Tag, Typography, Flex, Button, Popconfirm, Modal } from 'antd'
import {
  StarOutlined,
  EditOutlined,
  LineChartOutlined,
  CopyOutlined,
  DeleteOutlined
} from '@ant-design/icons'

const { Text } = Typography

type QuestionProps = {
  _id: string
  title: string
  createTime: string
  star: boolean
  publish: boolean
  updateLoading?: boolean
  deleteLoading?: boolean
  removeQuestion?: (id: string) => void
  starQuestion?: (id: string, star: boolean) => void
}

const QuestionCar: FC<QuestionProps> = props => {
  const { _id, title, publish, createTime, star, removeQuestion, starQuestion } = props

  const nav = useNavigate()
  function edit(id: string) {
    nav(`/question/edit/${id}?type=edit`)
  }
  function remove(id: string) {
    Modal.confirm({
      title: '确定删除吗？',
      content: '删除后不可恢复',
      type: 'warning',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        if (removeQuestion) {
          removeQuestion(id)
        }
      }
    })
  }
  function changeStar(_id: string, star: boolean) {
    if (starQuestion) {
      starQuestion(_id, star)
    }
  }
  const confirmCopy: PopconfirmProps['onConfirm'] = () => {
    nav(`/question/stat/${_id}?type=copy`)
  }

  return (
    <>
      <div key={_id} className={style['question-card']}>
        <Flex justify="space-between">
          <Space>
            {star && <StarOutlined style={{ color: 'red' }} />}
            <Link to={publish ? `/question/stat/${_id}` : `/question/edit/${_id}?type=edit`}>
              {title}
            </Link>
          </Space>

          <Space>
            {publish ? <Tag color="blue">已发布</Tag> : <Tag>未发布</Tag>}
            <Text strong>答卷：5</Text>
            <Text strong>{createTime}</Text>
          </Space>
        </Flex>

        <Divider style={{ margin: '10px 0' }} />

        <Flex justify="space-between" style={{ marginLeft: '-8px' }}>
          <Space>
            <Button type="text" size="small" icon={<EditOutlined />} onClick={() => edit(_id)}>
              编辑问卷
            </Button>
            <Button
              type="text"
              size="small"
              icon={<LineChartOutlined />}
              disabled={publish ? false : true}
              onClick={() => nav(`/question/stat/${_id}`)}
            >
              数据统计
            </Button>
          </Space>
          <Space>
            <Button
              type="text"
              size="small"
              disabled={props.updateLoading}
              icon={<StarOutlined />}
              onClick={() => changeStar(_id, !star)}
            >
              {star ? <span>取消标星</span> : <span>标星</span>}
            </Button>
            <Popconfirm
              title="提示"
              description="确定复制该问卷吗?"
              onConfirm={confirmCopy}
              okText="确定"
              cancelText="取消"
            >
              <Button type="text" size="small" icon={<CopyOutlined />}>
                复制
              </Button>
            </Popconfirm>

            <Button
              type="text"
              size="small"
              danger
              disabled={props.deleteLoading}
              icon={<DeleteOutlined />}
              onClick={() => remove(_id)}
            >
              删除
            </Button>
          </Space>
        </Flex>
      </div>
    </>
  )
}

export default QuestionCar
