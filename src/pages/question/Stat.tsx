import React, { useState } from 'react'
import style from './Stat.module.scss'
import StatHeader from './StatHeader'
import { useLoadQuestionData } from '../../hooks/useLoadQuestionData'
import StatSkeleton from './StatSkeleton'
import StatComponentList from './StatComponentList'
import StatTable from './StatTable'
import StatCharts from './StatCharts'

export default function Stat() {
  const { loading } = useLoadQuestionData()
  const [selectedId, setSelectedId] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [selectComponentName, setSelectComponentName] = useState('')

  if (loading) {
    return <StatSkeleton />
  }

  return (
    <div className={style.container}>
      <div className={style.header}>
        <StatHeader />
      </div>
      <div className={style.content}>
        <div className={style.left}>
          <StatComponentList
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedType={setSelectedType}
            setSelectComponentName={setSelectComponentName}
          />
        </div>
        <div className={style.tableWapper}>
          <StatTable
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            setSelectedType={setSelectedType}
            setSelectComponentName={setSelectComponentName}
          />
        </div>
        <div className={style.right}>
          <StatCharts
            selectedId={selectedId}
            selectedType={selectedType}
            name={selectComponentName}
          />
        </div>
      </div>
    </div>
  )
}
