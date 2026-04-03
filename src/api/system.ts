import { UserType, ApiResponse } from '../types/QuestionType'
import Base64 from '../utils/base64'
import http from '../utils/http'
export const systemLoginFun = (
  data: Partial<UserType>
): Promise<ApiResponse<{ token: string }>> => {
  return http({
    url: '/system/login',
    method: 'post',
    data: {
      userName: data.userName,
      passWord: new Base64().encode(data.passWord!)
    }
  })
}
export const systemGetUserInfoFun = (): Promise<ApiResponse<UserType>> => {
  return http({
    url: '/system/userInfo',
    method: 'get'
  })
}
export const systemRegisterFun = (data: Partial<UserType>): Promise<ApiResponse<null>> => {
  return http({
    url: '/system/register',
    method: 'post',
    data: {
      userName: data.userName,
      passWord: new Base64().encode(data.passWord!)
    }
  })
}
