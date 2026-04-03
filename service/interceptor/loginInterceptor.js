import { SECRET_KEY } from '../constant/dbConfig.js'
import jwt from 'jsonwebtoken'
const whiteList = [
  '/api/system/register',
  '/api/system/login',
  '/h5/getComponentsList',
  '/h5/submitAnswer'
]
const loginInterceptor = async (ctx, next) => {
  if (whiteList.includes(ctx.path)) {
    await next()
    return
  }

  const token =
    ctx.headers.authorization && ctx.headers.authorization.split(' ')[1]

  if (!token) {
    ctx.status = 401
    ctx.body = { message: '用户未登录' }
    return
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY)
    ctx.state.user = decoded
    await next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      ctx.status = 401
      ctx.body = {
        message: '令牌已过期',
        error: err
      }
      return
    } else if (err.name === 'JsonWebTokenError') {
      ctx.status = 401
      ctx.body = {
        message: '无效的令牌',
        error: err
      }
      return
    } else {
      ctx.status = 500
      ctx.body = {
        message: '服务器错误',
        error: err
      }
      return
    }
  }
}

export default loginInterceptor
