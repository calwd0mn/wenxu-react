import React, { FC, useEffect } from 'react'
// import StatPieChart from './StatPieChart'
// import StatBarChat from './StatBarChat'
import { useRequest } from 'ahooks'
import { getStatDataFun } from '../../../api/list'
import { useParams } from 'react-router-dom'
import { Empty, Flex, Spin } from 'antd'
import { getComponentConfByType } from '../../../components/QuestionComponents'
// import { getComponentConfByType } from '../../../components/QuestionComponents'

type StatChartsType = {
  selectedId: string
  selectedType: string
  name: string
}

const EmptyStat: FC = () => {
  return (
    <Flex justify="center" align="center" style={{ height: '100%' }}>
      <Empty description="暂无数据" />
    </Flex>
  )
}

const StatCharts: FC<StatChartsType> = props => {
  const { selectedId, selectedType, name } = props
  const { id } = useParams()
  const {
    run: getStat,
    loading,
    data
  } = useRequest(async params => await getStatDataFun(params), {
    manual: true
  })
  useEffect(() => {
    if (id && selectedId) {
      getStat({
        questionId: id,
        componentId: selectedId,
        name
      })
    }
  }, [id, selectedId])

  if (loading) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Spin />
      </Flex>
    )
  }

  if (!id || !selectedId || !data?.data) {
    return <EmptyStat />
  }

  function genStatComponent() {
    const { StatComponent } = getComponentConfByType(selectedType) || {}
    if (!StatComponent) return <EmptyStat />
    return <StatComponent stat={data?.data || []} />
  }

  return <>{genStatComponent()}</>
}

export default StatCharts
