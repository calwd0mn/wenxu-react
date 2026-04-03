import React, { FC, useEffect, useState } from 'react'
import QuestionHeader from '../../components/QuestionHeader'
import { Space, Table, Tag, Button, message } from 'antd'
import type { TableProps } from 'antd'
import { QuestionType } from '../../types/QuestionType'
import { useLoadQuestionListData } from '../../hooks/useLoadQuestionListData'
import ListPage from '../../components/ListPage'
import { useRequest } from 'ahooks'
import { removeQuestionFun, restoreQuestionFun } from '../../api/list'

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

interface DataType {
  _id: string
  title: string
  createTime: string
  publish: boolean
  star: boolean
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: '问卷名称',
    dataIndex: 'title'
  },
  {
    title: '创建时间',
    dataIndex: 'createTime'
  },
  {
    title: '是否标星',
    dataIndex: 'star',
    render: (_, { star }) => <>{star ? <Tag color="blue">已标星</Tag> : <Tag>未标星</Tag>}</>
  },
  {
    title: '问卷状态',
    dataIndex: 'publish',
    render: (_, { publish }) => <>{publish ? <Tag color="blue">已发布</Tag> : <Tag>未发布</Tag>}</>
  }
]
const List: FC = () => {
  const [questionData, setQuestionData] = useState<QuestionType[]>([])
  const [total, setTotal] = useState<number>(0)

  const { data, loading, refresh } = useLoadQuestionListData({ isDelete: 1 })

  useEffect(() => {
    if (data) {
      setQuestionData(data.data.list)
      setTotal(data.data.total)
    }
  }, [data])

  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys)
  }

  const rowSelection: TableRowSelection<DataType> = {
    columnWidth: '50px',
    selectedRowKeys,
    onChange: onSelectChange
  }
  const { run: restoreFun, loading: restoreLoading } = useRequest(
    async ids => await restoreQuestionFun(ids),
    {
      manual: true,
      onSuccess(res) {
        message.success(res.message)
        setSelectedRowKeys([])
        refresh()
      }
    }
  )
  const restore = () => {
    restoreFun(selectedRowKeys as string[])
  }
  const { run: removeFun, loading: removeLaoding } = useRequest(
    async ids => await removeQuestionFun(ids),
    {
      manual: true,
      onSuccess(res) {
        message.success(res.message)
        setSelectedRowKeys([])
        refresh()
      }
    }
  )
  const remove = () => {
    removeFun(selectedRowKeys as string[])
  }

  return (
    <>
      <QuestionHeader title="回收站" />
      <Space style={{ marginBottom: '15px' }}>
        <Button onClick={restore} loading={restoreLoading} disabled={selectedRowKeys.length <= 0}>
          还原
        </Button>
        <Button
          onClick={remove}
          loading={removeLaoding}
          disabled={selectedRowKeys.length <= 0}
          danger
        >
          彻底删除
        </Button>
      </Space>

      <Table<DataType>
        loading={loading}
        rowKey={'_id'}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={questionData}
        pagination={false}
      />
      <div style={{ marginTop: '15px' }}>
        <ListPage total={total} />
      </div>
    </>
  )
}

export default List
