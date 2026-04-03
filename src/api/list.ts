import { componentInfoType } from '../store/componentsReducer'
import { PageInfoPropsType } from '../store/pageInfoReducer'
import {
  AiGenerateRequest,
  AiGenerateResponse,
  AiOptimizeComponentRequest,
  AiOptimizeComponentResponse
} from '../types/AiType'
import { QuestionType, ApiResponse } from '../types/QuestionType'
import http from '../utils/http'

type QuestionSearchProp = {
  title: string
  isDelete: number
  star: boolean
  pageNum: number
  pageSize: number
}
export const getQuestionListFun = (
  params: Partial<QuestionSearchProp>
): Promise<ApiResponse<{ list: QuestionType[]; total: number }>> => {
  return http({
    url: '/question/list',
    method: 'get',
    params: params
  })
}
export type AddQuestionType = PageInfoPropsType & {
  componentsList: componentInfoType[]
}
export const addQuestionFun = (
  data: AddQuestionType
): Promise<ApiResponse<{ insertedId: string }>> => {
  return http({
    url: '/question/add',
    method: 'post',
    data
  })
}
export const getQuestionInfoFun = (
  _id: string
): Promise<ApiResponse<QuestionType>> => {
  return http({
    url: '/question/getInfo',
    method: 'get',
    params: {
      _id
    }
  })
}
export const updateQuestionInfoFun = (
  data: Partial<QuestionType>
): Promise<ApiResponse<QuestionType>> => {
  return http({
    url: '/question/update',
    method: 'post',
    data
  })
}
export const deleteQuestionFun = (
  _id: string
): Promise<ApiResponse<{ _id: string }>> => {
  return http({
    url: '/question/delete',
    method: 'delete',
    params: {
      _id
    }
  })
}
export const restoreQuestionFun = (
  ids: string[]
): Promise<ApiResponse<null>> => {
  return http({
    url: '/question/restore',
    method: 'put',
    data: {
      ids
    }
  })
}
export const removeQuestionFun = (
  ids: string[]
): Promise<ApiResponse<null>> => {
  return http({
    url: '/question/remove',
    method: 'put',
    data: {
      ids
    }
  })
}
type answerType = {
  _id: string
  value: string
}
export type answerParamType = {
  questionId: string
  pageNum: number
  pageSize: number
}
export const getAnswerListFun = (
  params: answerParamType
): Promise<
  ApiResponse<{
    total: number
    rows: answerType[]
  }>
> => {
  return http({
    url: '/question/getAnswerList',
    method: 'get',
    params
  })
}
export type statParamType = {
  questionId: string
  componentId: string
  name: string
}
export type statDataType = Array<{
  value: string
  count: number
}>
export const getStatDataFun = (
  params: statParamType
): Promise<ApiResponse<statDataType>> => {
  return http({
    url: '/question/stat',
    method: 'get',
    params
  })
}
export type QuestionStatisticsType = {
  questionTotal: number
  published: number
  answered: number
}
export const getQuestionStatisticsFun = (): Promise<
  ApiResponse<QuestionStatisticsType>
> => {
  return http({
    url: '/question/getQuestionStatistics',
    method: 'get'
  })
}

export const generateQuestionByAi = (
  data: AiGenerateRequest
): Promise<ApiResponse<AiGenerateResponse>> => {
  return http({
    url: '/ai/question/generate',
    method: 'post',
    data
  })
}

export const optimizeQuestionComponentByAi = (
  data: AiOptimizeComponentRequest
): Promise<ApiResponse<AiOptimizeComponentResponse>> => {
  return http({
    url: '/ai/question/optimize-component',
    method: 'post',
    data
  })
}
