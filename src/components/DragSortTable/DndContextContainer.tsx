import React, { FC, JSX } from 'react'
import { DndContext, MouseSensor, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToParentElement } from '@dnd-kit/modifiers'
import type { DragEndEvent } from '@dnd-kit/core'

type Props = {
  children: JSX.Element
  onDragEnd: (dragItem: DragEndEvent) => void
}

const SortTableContaoner: FC<Props> = props => {
  const { children, onDragEnd: dragEndEvent } = props
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5
      }
    })
  )

  return (
    <DndContext sensors={sensors} onDragEnd={dragEndEvent} modifiers={[restrictToParentElement]}>
      {children}
    </DndContext>
  )
}

export default SortTableContaoner
