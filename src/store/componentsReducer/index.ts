import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { ComponentPropsType } from '../../components/QuestionComponents'
import { produce } from 'immer'
import { getNextSelectedId, insertNewComponent } from './utils'
import { cloneDeep } from 'lodash'
import { nanoid } from 'nanoid'
export type componentInfoType = {
  _id: string
  name: string
  title: string
  type: string
  props: ComponentPropsType
  isHidden?: boolean
  isLock?: boolean
}

export type ComponentsStateType = {
  selectedId: string
  componentsList: Array<componentInfoType>
  copiedComponent?: componentInfoType
}
const INIT_STATE: ComponentsStateType = {
  selectedId: '',
  componentsList: [],
  copiedComponent: undefined
}

export const componentsSlice = createSlice({
  name: 'components',
  initialState: INIT_STATE,
  reducers: {
    resertComponents(
      state: ComponentsStateType,
      action: PayloadAction<ComponentsStateType>
    ) {
      return action.payload
    },
    changeSelectedId: produce(
      (draft: ComponentsStateType, action: PayloadAction<string>) => {
        draft.selectedId = action.payload
      }
    ),
    addComponent: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<componentInfoType>
      ) => {
        const newComponent = action.payload
        insertNewComponent(draft, newComponent)
      }
    ),
    updateComponentProps: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{
          _id: string
          newProps: ComponentPropsType
        }>
      ) => {
        const { _id, newProps } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (target) {
          target.props = newProps
        }
      }
    ),
    deleteComponent: produce((draft: ComponentsStateType) => {
      const removeIndex = draft.componentsList.findIndex(
        item => item._id === draft.selectedId
      )
      draft.selectedId = getNextSelectedId(
        draft.selectedId,
        draft.componentsList
      )
      draft.componentsList.splice(removeIndex, 1)
    }),
    hiddenComponent: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{ _id: string; isHidden: boolean }>
      ) => {
        const { _id, isHidden } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (target) {
          if (isHidden) {
            draft.selectedId = getNextSelectedId(_id, draft.componentsList)
          } else {
            draft.selectedId = _id
          }
          target.isHidden = isHidden
        }
      }
    ),
    toogleLock: produce(
      (draft: ComponentsStateType, action: PayloadAction<{ _id: string }>) => {
        const { _id } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (target) {
          target.isLock = !target.isLock
        }
      }
    ),
    copyComponent: produce(
      (draft: ComponentsStateType, action: PayloadAction<{ _id: string }>) => {
        const { _id } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (target) {
          draft.copiedComponent = cloneDeep(target)
        }
      }
    ),
    pasteComponent: produce((draft: ComponentsStateType) => {
      if (draft.copiedComponent) {
        draft.copiedComponent._id = nanoid()
        insertNewComponent(draft, draft.copiedComponent)
      }
    }),
    selectPrevComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentsList } = draft
      const index = componentsList.findIndex(item => item._id === selectedId)
      if (index <= 0) return
      draft.selectedId = componentsList[index - 1]._id
    }),
    selectNextComponent: produce((draft: ComponentsStateType) => {
      const { selectedId, componentsList } = draft
      const index = componentsList.findIndex(item => item._id === selectedId)
      if (index === componentsList.length - 1) return
      draft.selectedId = componentsList[index + 1]._id
    }),
    changeComponentTitle: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{
          _id: string
          title: string
        }>
      ) => {
        const { _id, title } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (target) {
          target.title = title
        }
      }
    ),
    reorderComponents: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<Array<componentInfoType>>
      ) => {
        draft.componentsList = action.payload
      }
    ),
    replaceComponents: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<Array<componentInfoType>>
      ) => {
        draft.componentsList = action.payload
        draft.selectedId = action.payload[0]?._id || ''
      }
    ),
    replaceComponentById: produce(
      (
        draft: ComponentsStateType,
        action: PayloadAction<{
          _id: string
          component: Partial<componentInfoType>
        }>
      ) => {
        const { _id, component } = action.payload
        const target = draft.componentsList.find(item => item._id === _id)
        if (!target) return

        Object.assign(target, component)
        draft.selectedId = _id
      }
    )
  }
})

export const {
  resertComponents,
  changeSelectedId,
  addComponent,
  updateComponentProps,
  deleteComponent,
  hiddenComponent,
  toogleLock,
  copyComponent,
  pasteComponent,
  selectPrevComponent,
  selectNextComponent,
  changeComponentTitle,
  reorderComponents,
  replaceComponents,
  replaceComponentById
} = componentsSlice.actions
// export default undoable(componentsSlice.reducer, {
//   filter: excludeAction([
//     'componentsSlice/changeSelectedId',
//     'componentsSlice/selectPrevComponent',
//     'componentsSlice/selectNextComponent',
//     'componentsSlice/resertComponents'
//   ]),
//   limit: 20,
//   undoType: 'components/UNDO',
//   redoType: 'components/REDO'
// })

export default componentsSlice.reducer
