import React, { FC, JSX } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

type Prop = {
  children: JSX.Element
  id: string
}
const DraggableItem: FC<Prop> = props => {
  const { id, children } = props
  const { setNodeRef, attributes, listeners, transform, transition } = useSortable({
    id: id,
    transition: {
      duration: 500,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    }
  })
  const styles = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div ref={setNodeRef} style={styles} {...attributes} {...listeners}>
      {children}
    </div>
  )
}

export default DraggableItem
