import { createSlice } from '@reduxjs/toolkit'

export type UserInfoType = {
  userId: string
  userName: string
  roles: string[]
}

const initialState: UserInfoType = {
  userId: '',
  userName: '',
  roles: []
}

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo(state, action) {
      state.userName = action.payload.userName
      localStorage.setItem('userName', action.payload.userName)

      state.userId = action.payload._id
      localStorage.setItem('userId', action.payload._id)

      state.roles = action.payload.roles || []
      localStorage.setItem('roles', JSON.stringify(action.payload.roles))

      localStorage.setItem('userInfo', JSON.stringify(action.payload))
    },
    clearUserInfo(state) {
      state.userName = ''
      state.userId = ''
      state.roles = []
      localStorage.clear()
      window.location.href = '/login'
    }
  }
})

export const { setUserInfo, clearUserInfo } = userInfoSlice.actions

export default userInfoSlice.reducer
