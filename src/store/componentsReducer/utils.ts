import { componentInfoType, ComponentsStateType } from '.'

export function getNextSelectedId(selectedId: string, componentsList: componentInfoType[]) {
  const visibleComponents = componentsList.filter(item => !item.isHidden)
  const index = visibleComponents.findIndex(item => item._id === selectedId)
  if (index >= 0) {
    if (visibleComponents.length <= 1) return ''
    if (index === visibleComponents.length - 1) return visibleComponents[index - 1]._id
    return visibleComponents[index + 1]._id
  } else {
    return ''
  }
}

export function insertNewComponent(draft: ComponentsStateType, newComponent: componentInfoType) {
  if (draft.selectedId) {
    const index = draft.componentsList.findIndex(item => item._id === draft.selectedId)
    draft.componentsList.splice(index + 1, 0, newComponent)
  } else {
    draft.componentsList.push(newComponent)
  }
  draft.selectedId = newComponent._id
}
