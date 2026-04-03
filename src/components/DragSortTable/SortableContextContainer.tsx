import React, { FC, JSX } from 'react'
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'

type Props = {
  children: JSX.Element
  items: string[]
}
const SortableContextContainer: FC<Props> = props => {
  const { items, children } = props
  return (
    <SortableContext items={items} strategy={rectSortingStrategy}>
      {children}
    </SortableContext>
  )
}

export default SortableContextContainer
