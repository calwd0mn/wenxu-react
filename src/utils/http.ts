// src/utils/http.ts
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { message } from 'antd'
import { getToken, loginOut } from '../hooks/userUserInfoStore'
interface ResponseData<T = any> {
  code: number
  data?: T
  message?: string
}

interface CustomRequestConfig extends AxiosRequestConfig {
  hideErrorMessage?: boolean
}
const createHttpInstance = () => {
  const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 60000,
    headers: { 'Content-Type': 'application/json' }
  })
  instance.interceptors.request.use(config => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  })
  instance.interceptors.response.use(
    (response: AxiosResponse<ResponseData>) => handleResponse(response),
    error => handleHttpError(error)
  )

  return instance
}
const handleResponse = (response: AxiosResponse) => {
  const res = response.data
  const config = response.config as CustomRequestConfig

  if (res.code === 200) {
    return res
  }

  const errorMsg = res.message || '请求处理失败'
  if (!config.hideErrorMessage) {
    message.error(errorMsg)
  }

  return Promise.reject(new Error(errorMsg))
}
const handleHttpError = (error: any) => {
  const errorMessage = getHttpErrorMsg(error)
  const config = error.config as CustomRequestConfig | undefined

  if (!config?.hideErrorMessage) {
    message.error(errorMessage)
  }

  return Promise.reject(new Error(errorMessage))
}
const getHttpErrorMsg = (error: any): string => {
  if (error.response) {
    switch (error.response.status) {
      case 401:
        setTimeout(() => {
          loginOut()
        }, 1000)
        return '登录已过期，请重新登录'
      case 403:
        return '拒绝访问'
      case 500:
        return '服务器内部错误'
      default:
        return error.response.data?.msg || '请求错误'
    }
  }
  return error.request ? '网络连接异常' : '未知错误'
}
const httpInstance = createHttpInstance()

export default <T = any>(config: CustomRequestConfig) =>
  httpInstance.request<T, T>(config)
