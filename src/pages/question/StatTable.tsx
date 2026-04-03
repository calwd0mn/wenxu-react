import React, { useEffect, useState } from 'react'
import { Flex, Table, theme, Popover } from 'antd'
import type { TableProps } from 'antd'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { componentInfoType } from '../../store/componentsReducer'
import { useRequest } from 'ahooks'
import { answerParamType, getAnswerListFun } from '../../api/list'
import { useParams } from 'react-router-dom'
import {
  LIST_PAGE_DEFAULT_CURRENT,
  LIST_PAGE_DEFAULT_SIZE
} from '../../constant'
import { produce } from 'immer'
import { ReloadOutlined } from '@ant-design/icons'
const colorPrimary = theme.defaultConfig.token.colorPrimary

type StatTableType = {
  selectedId: string
  setSelectedId: (id: string) => void
  setSelectedType: (type: string) => void
  setSelectComponentName: (name: string) => void
}

const StatTable: React.FC<StatTableType> = props => {
  const { selectedId, setSelectedId, setSelectedType, setSelectComponentName } =
    props
  const { id } = useParams()
  const [pageInfo, setPageInfo] = useState<answerParamType>({
    questionId: id!,
    pageNum: LIST_PAGE_DEFAULT_CURRENT,
    pageSize: LIST_PAGE_DEFAULT_SIZE
  })
  const {
    loading,
    data,
    run: getTableData
  } = useRequest(async () => await getAnswerListFun(pageInfo), {
    manual: true
  })
  const { componentsList } = useGetComponentInfo()

  useEffect(() => {
    getTableData()
  }, [pageInfo])
  function getColumns() {
    const columns: TableProps['columns'] = []
    componentsList.forEach((component: componentInfoType) => {
      const { _id, props, title, type, name } = component
      columns.push({
        title: (
          <div
            style={{
              cursor: 'pointer',
              color: selectedId === _id ? colorPrimary : 'black'
            }}
            onClick={() => {
              setSelectedId(_id)
              setSelectedType(type)
              setSelectComponentName(name)
            }}
          >
{props!.title || title}
          </div>
        ),
        dataIndex: name,
        key: _id,
        render: text => <div style={{ minWidth: '50px' }}>{text || '--'}</div>
      })
    })
    return columns
  }

  return (
    <div>
      <Flex
        gap={10}
        align="center"
        justify="space-between"
        style={{ marginBottom: 15 }}
      >
        <div style={{ fontSize: 18 }}>答卷数量：{data?.data.total}</div>
        <div onClick={() => getTableData()}>
          <Popover placement="bottom" content={'刷新'}>
            <ReloadOutlined />
          </Popover>
        </div>
      </Flex>

      <Table
        loading={loading}
        columns={getColumns()}
        key={'_id'}
        dataSource={data?.data.rows.map(item => {
          return {
            key: item._id,
            ...item
          }
        })}
        scroll={{ x: '100%' }}
        pagination={{
          total: data?.data.total,
          showTotal: total => `共 ${total} 条`,
          showSizeChanger: true,
          onChange: (page: number, pageSize: number) => {
            setPageInfo(
              produce(draft => {
                draft.pageNum = page
                draft.pageSize = pageSize
              })
            )
          }
        }}
      />
    </div>
  )
}

export default StatTable
