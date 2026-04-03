import {
  EditOutlined,
  LeftOutlined,
  SaveOutlined,
  CheckOutlined
} from '@ant-design/icons'
import { Button, Flex, Input, message, Space, Typography } from 'antd'
import React, { FC, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import EditToolbar from './EditToolbar'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { addQuestionFun, updateQuestionInfoFun } from '../../api/list'
import useGetPageInfo from '../../hooks/useGetPageInfo'
import { changeTitle } from '../../store/pageInfoReducer'
import { useDispatch } from 'react-redux'
import { useKeyPress, useRequest } from 'ahooks'
import style from './EditHeader.module.scss'

type EditHeaderProps = {
  onOpenAi: () => void
}

export default function EditHeader({ onOpenAi }: EditHeaderProps) {
  const nav = useNavigate()
  const disptach = useDispatch()
  const { id } = useParams()
  const { componentsList } = useGetComponentInfo()
  const { title } = useGetPageInfo()
  const [editTitle, setEditTitle] = useState(false)
  const pageInfo = useGetPageInfo()
  const [showSucessResult, setShowSucessResult] = useState(false)
  const { run: addQuestion } = useRequest(
    async () =>
      await addQuestionFun({
        ...pageInfo,
        componentsList
      }),
    {
      manual: true,
      onSuccess: res => {
        message.success(res.message)
        nav(-1)
      }
    }
  )
  const { run: saveFun, loading } = useRequest(
    async (isPublish: boolean) => {
      return await updateQuestionInfoFun({
        _id: id,
        ...pageInfo,
        publish: isPublish,
        componentsList
      })
    },
    {
      manual: true,
      onSuccess: () => {
        setShowSucessResult(true)
        setTimeout(() => {
          setShowSucessResult(false)
        }, 2000)
      }
    }
  )
  function unifiedSubmit(isPublish: boolean) {
    if (id) {
      saveFun(isPublish)
    } else {
      addQuestion()
    }
  }
  useKeyPress(['ctrl.s', 'meta.s'], (evnet: KeyboardEvent) => {
    evnet.preventDefault()
    unifiedSubmit(pageInfo.publish)
  })
  // useDebounceEffect(
  //   () => {
  //     if (id) {
  //       unifiedSubmit(pageInfo.publish)
  //     }
  //   },
  //   [componentsList, pageInfo],
  //   { wait: 1000 }
  // )
  function onChangeInput(event: React.ChangeEvent<HTMLInputElement>) {
    disptach(changeTitle(event.target.value))
  }
  const SaveButton: FC = () => {
    function saveQuestionList() {
      unifiedSubmit(pageInfo.publish)
    }

    return (
      <Button
        type="primary"
        icon={<SaveOutlined />}
        loading={loading}
        onClick={saveQuestionList}
      >
        保存
      </Button>
    )
  }
  const PublishButtion: FC = () => {
    function saveAndPublish() {
      saveFun(true)
      nav(`/question/stat/${id}`)
    }

    return (
      <Button
        type="primary"
        icon={<SaveOutlined />}
        loading={loading}
        onClick={saveAndPublish}
      >
        保存并发布
      </Button>
    )
  }

  const TitleElem: React.FC = () => {
    return (
      <Space>
        {editTitle && (
          <Input
            value={title}
            onBlur={() => setEditTitle(false)}
            onPressEnter={() => setEditTitle(false)}
            onChange={event => onChangeInput(event)}
            style={{ width: '300px' }}
          />
        )}
        {!editTitle && <Typography.Text strong>{title}</Typography.Text>}
        <EditOutlined onClick={() => setEditTitle(!editTitle)} />
      </Space>
    )
  }

  return (
    <div className={style.headerLayout}>
      <div className={style.headerSide}>
        <Space>
          <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
            返回
          </Button>
          <TitleElem />
        </Space>
      </div>
      <div className={style.headerCenter}>
        <div className={style.toolbarWrap}>
          <EditToolbar />
        </div>
      </div>
      <div className={`${style.headerSide} ${style.headerActions}`}>
        {showSucessResult && (
          <Flex align="center" gap={5} style={{ marginRight: 30 }}>
            <div className={style.successIcon}>
              <CheckOutlined />
            </div>
            <div style={{ fontSize: 13 }}>保存成功</div>
          </Flex>
        )}

        <Button>取消</Button>
        <Button onClick={onOpenAi}>AI 助手</Button>
        <SaveButton />
        <PublishButtion />
      </div>
    </div>
  )
}
