import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { produce } from 'immer'

export type PageInfoPropsType = {
  title: string
  description?: string
  publish: boolean
  star: boolean
  jsCode?: string
  cssCode?: string
}
export const pageInfoDefaultProps: PageInfoPropsType = {
  title: '问卷标题',
  description: '问卷描述',
  jsCode: '',
  cssCode: '',
  publish: false,
  star: false
}

const usePagesInfoSlice = createSlice({
  name: 'pageInfo',
  initialState: pageInfoDefaultProps,
  reducers: {
    /**
     *
     *
     */
    resertPageInfo(state: PageInfoPropsType, action: PayloadAction<PageInfoPropsType>) {
      return action.payload
    },
    changeTitle: produce((draft: PageInfoPropsType, action: PayloadAction<string>) => {
      draft.title = action.payload
    })
  }
})

export const { resertPageInfo, changeTitle } = usePagesInfoSlice.actions

export default usePagesInfoSlice.reducer
