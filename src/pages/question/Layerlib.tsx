import React, { ChangeEvent, FC, useState } from 'react'
import useGetComponentInfo from '../../hooks/useGetComponentInfo'
import { Button, Flex, Input, message, Space } from 'antd'
import style from './Layerlib.module.scss'
import { EyeInvisibleOutlined, LockOutlined, DragOutlined } from '@ant-design/icons'
import classNames from 'classnames'
import { useDispatch } from 'react-redux'
import {
  changeSelectedId,
  changeComponentTitle,
  componentInfoType,
  hiddenComponent,
  toogleLock,
  reorderComponents
} from '../../store/componentsReducer'

import type { DragEndEvent, DragMoveEvent } from '@dnd-kit/core'
import { DndContext } from '@dnd-kit/core'
import { arrayMove, SortableContext, rectSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import { CSS } from '@dnd-kit/utilities'

export default function Layerlib() {
  const [changingId, setChangingId] = useState('')
  const { componentsList, selectedId } = useGetComponentInfo()
  const dispatch = useDispatch()
  function handleClick(component: componentInfoType) {
    const { _id, isHidden } = component

    if (isHidden) {
      message.error('不能选中被隐藏的组件')
      return
    }

    if (_id !== selectedId) {
      dispatch(changeSelectedId(_id))
      setChangingId('')
    } else {
      setChangingId(_id)
    }
  }
  function handleChangeTitle(event: ChangeEvent<HTMLInputElement>, id: string) {
    const value = event.target.value.trim()
    if (!value) return
    dispatch(changeComponentTitle({ _id: id, title: value }))
  }
  function handleToggleHidden(component: componentInfoType) {
    const { _id, isHidden } = component
    dispatch(hiddenComponent({ _id, isHidden: !isHidden }))
  }
  function handleToggleLock(component: componentInfoType) {
    const { _id } = component
    dispatch(toogleLock({ _id }))
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

  type DraggableItemProps = {
    component: componentInfoType
  }
  const DraggableItem: FC<DraggableItemProps> = ({ component }) => {
    const { _id, isLock, isHidden } = component
    const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
      id: _id,
      transition: {
        duration: 500,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      }
    })
    const styles = {
      transform: CSS.Transform.toString(transform),
      transition
    }
    const componentClass = classNames({
      [style.check]: _id === selectedId,
      [style.hidden]: isHidden
    })

    return (
      <Flex
        key={_id}
        align="center"
        justify="space-between"
        gap={10}
        className={style.layerItem}
        ref={setNodeRef}
        style={styles}
      >
        <div className={componentClass} style={{ flex: 1 }} onClick={() => handleClick(component)}>
          {changingId === _id ? (
            <Input
              value={component.title}
              autoFocus
              onChange={event => handleChangeTitle(event, component._id)}
              onPressEnter={() => setChangingId('')}
              onBlur={() => setChangingId('')}
            />
          ) : (
            component.title
          )}
        </div>
        <Space>
<Button
            size="small"
            shape="circle"
            icon={<DragOutlined />}
            type="text"
            style={{
              cursor: 'move'
            }}
            {...attributes}
            {...listeners}
          />

          <Button
            size="small"
            shape="circle"
            icon={<EyeInvisibleOutlined />}
            type={isHidden ? 'primary' : 'text'}
            onClick={() => handleToggleHidden(component)}
          />
          <Button
            size="small"
            shape="circle"
            icon={<LockOutlined />}
            type={isLock ? 'primary' : 'text'}
            onClick={() => handleToggleLock(component)}
          />
        </Space>
      </Flex>
    )
  }

  return (
    <DndContext onDragEnd={dragEndEvent} modifiers={[restrictToParentElement]}>
      <SortableContext items={componentsList.map(item => item._id)} strategy={rectSortingStrategy}>
        <div>
          {componentsList.map(component => (
            <DraggableItem key={component._id} component={component} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
