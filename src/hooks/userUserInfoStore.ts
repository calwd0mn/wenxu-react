import { useDispatch, useSelector } from 'react-redux'
import {
  setUserInfo,
  clearUserInfo,
  UserInfoType
} from '../store/userInfoSlice'
import store, { RootState } from '../store'

const useUserInfoStore = () => {
  const dispatch = useDispatch()
  const reduxUserName = useSelector(
    (state: RootState) => state.userInfo.userName
  )
  const reduxUserId = useSelector((state: RootState) => state.userInfo.userId)
  const reduxRoles = useSelector((state: RootState) => state.userInfo.roles)
  const userName = localStorage.getItem('userName') || reduxUserName
  const userId = localStorage.getItem('userId') || reduxUserId
  const roles = localStorage.getItem('roles') || reduxRoles

  const setInfo = (info: UserInfoType) => dispatch(setUserInfo(info))
  const clearInfo = () => dispatch(clearUserInfo())

  return { userName, userId, roles, setInfo, clearInfo }
}
export const getToken = () => {
  return localStorage.getItem('token') || ''
}

export const loginOut = () => {
  store.dispatch(clearUserInfo())
}

export const setToken = (token: string) => {
  localStorage.setItem('token', token)
}

export default useUserInfoStore
