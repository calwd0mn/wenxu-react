import { componentInfoType } from '../store/componentsReducer'

export interface QuestionType {
  _id: string
  title: string
  createTime: string
  star: boolean
  publish: boolean
  isDelete: boolean
  description?: string
  jsCode?: string
  cssCode?: string
  componentsList: componentInfoType[]
}

export interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

export type UserType = {
  userId: string
  userName: string
  passWord: string
  roles: string[]
  token: string
}
