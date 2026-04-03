import React, { FC } from 'react'
import style from './EditCanvas.module.scss'
import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'

import { Spin } from 'antd'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import {
  changeSelectedId,
  componentInfoType,
  reorderComponents
} from '../../store/componentsReducer'
import { getComponentConfByType } from '../../components/QuestionComponents'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'
import DndContextContaoner from '../../components/DragSortTable/DndContextContainer'
import SortableContextContainer from '../../components/DragSortTable/SortableContextContainer'
import DraggableItem from '../../components/DragSortTable/DraggableItem'

type EditCanvasProps = {
  loading: boolean
}

function genComponent(compItem: componentInfoType) {
  const { type, props } = compItem

  const componentConf = getComponentConfByType(type)

  if (!componentConf) return null
  const { Component } = componentConf

  return <Component {...props}></Component>
}

export default function EditCanvas(props: EditCanvasProps) {
  const { loading } = props
  const { componentsList, selectedId } = useGetComponentInfo()
  const dispatch = useDispatch()

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 25 }}>
        <Spin />
      </div>
    )
  }

  function handleClick(event: React.MouseEvent<HTMLDivElement>, item: componentInfoType) {
    event.stopPropagation()
    dispatch(changeSelectedId(item._id))
  }
  const getMoveIndex = (array: componentInfoType[], dragItem: DragMoveEvent) => {
    const { active, over } = dragItem
    const activeIndex = array.findIndex(item => item._id === active.id)
    const overIndex = array.findIndex(item => item._id === over?.id)
    return {
      activeIndex: activeIndex !== -1 ? activeIndex : 0,
      overIndex: overIndex !== -1 ? overIndex : activeIndex
    }
  }
  const dragEndEvent = (dragItem: DragEndEvent) => {
    const { active, over } = dragItem
    if (!active || !over) return

    const moveDataList = [...componentsList]
    const { activeIndex, overIndex } = getMoveIndex(moveDataList, dragItem)

    if (activeIndex !== overIndex) {
      const newDataList = arrayMove(moveDataList, activeIndex, overIndex)
      dispatch(reorderComponents(newDataList))
    }
  }

  type ComponentItemType = {
    component: componentInfoType
  }
  const ComponentItem: FC<ComponentItemType> = ({ component }) => {
    const { _id } = component
    const componentClass = classNames({
      [style.wrapper]: true,
      [style.selected]: _id === selectedId,
      [style.locked]: component.isLock
    })

    return (
      <DraggableItem id={_id}>
        <div className={componentClass} onClick={event => handleClick(event, component)}>
          <div className={style['pointer-events']}>{genComponent(component)}</div>
        </div>
      </DraggableItem>
    )
  }

  return (
    <div className={style.canvas}>
      <DndContextContaoner onDragEnd={dragEndEvent}>
        <SortableContextContainer items={componentsList.map(item => item._id)}>
          <>
            {componentsList
              .filter(i => !i.isHidden)
              .map(item => {
                return <ComponentItem key={item._id} component={item} />
              })}
          </>
        </SortableContextContainer>
      </DndContextContaoner>
    </div>
  )
}
