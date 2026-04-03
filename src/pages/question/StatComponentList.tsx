import React, { FC } from 'react'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { componentInfoType } from '../../store/componentsReducer'
import classNames from 'classnames'
import style from './EditCanvas.module.scss'
import { getComponentConfByType } from '../../components/QuestionComponents'

function genComponent(compItem: componentInfoType) {
  const { type, props } = compItem
  const componentConf = getComponentConfByType(type)
  if (!componentConf) return null
  const { Component } = componentConf
  return <Component {...props}></Component>
}
type ComponentItemType = {
  component: componentInfoType
  selectedId: string
  setSelectedId: (id: string) => void
  setSelectedType: (type: string) => void
  setSelectComponentName: (name: string) => void
}
const ComponentItem: FC<ComponentItemType> = ({
  component,
  selectedId,
  setSelectedId,
  setSelectedType,
  setSelectComponentName
}) => {
  const { _id } = component
  const componentClass = classNames({
    [style.wrapper]: true,
    [style.selected]: _id === selectedId,
    [style.locked]: component.isLock
  })

  const genComponentClass = classNames({
    [style['pointer-events']]: true
  })

  function handleClick(
    event: React.MouseEvent<HTMLDivElement>,
    item: componentInfoType
  ) {
    event.stopPropagation()
    setSelectedId(item._id)
    setSelectedType(item.type)
    setSelectComponentName(item.name)
  }

  return (
    <div
      className={componentClass}
      onClick={event => handleClick(event, component)}
    >
      <div className={genComponentClass}>{genComponent(component)}</div>
    </div>
  )
}

type StatComponentListType = {
  selectedId: string
  setSelectedId: (id: string) => void
  setSelectedType: (type: string) => void
  setSelectComponentName: (name: string) => void
}
const StatComponentList: FC<StatComponentListType> = props => {
  const { componentsList } = useGetComponentInfo()
  const { selectedId, setSelectedId, setSelectedType, setSelectComponentName } =
    props

  return (
    <div className={style.canvas}>
      {componentsList
        .filter(i => !i.isHidden)
        .map(item => {
          return (
            <ComponentItem
              key={item._id}
              component={item}
              selectedId={selectedId}
              setSelectedId={setSelectedId}
              setSelectedType={setSelectedType}
              setSelectComponentName={setSelectComponentName}
            />
          )
        })}
    </div>
  )
}
export default StatComponentList
