import { connectToDatabase } from '../data/db.js'
import { COLLECTION_USERLIST, SECRET_KEY } from '../constant/dbConfig.js'
import { formatDate } from '../utils/index.js'
import { Result } from '../utils/result.js'
import { ObjectId } from 'mongodb'
import jwt from 'jsonwebtoken'

const db = await connectToDatabase()
const questionCollection = await db.collection(COLLECTION_USERLIST)

export default [
  {
    url: '/api/system/register',
    method: 'post',
    response: async ctx => {
      const { userName, passWord } = ctx.request.body
      if (await questionCollection.findOne({ userName })) {
        return Result.error().setMsg('用户名重复')
      }

      await questionCollection.insertOne({
        userName,
        passWord,
        createTime: formatDate()
      })
      return Result.success()
    }
  },
  {
    url: '/api/system/login',
    method: 'post',
    response: async ctx => {
      const { userName, passWord } = ctx.request.body
      const user = await questionCollection.findOne({
        userName,
        passWord
      })
      if (user !== null) {
        const token = jwt.sign({ userName, _id: user._id }, SECRET_KEY, { expiresIn: '12h' })
        return Result.success({ token })
      } else {
        return Result.error().setMsg('用户名或密码错误')
      }
    }
  },
  {
    url: '/api/system/userInfo',
    method: 'get',
    response: async ctx => {
      const { _id } = ctx.state.user
      const user = await questionCollection.findOne({
        _id: new ObjectId(_id)
      })
      delete user.passWord
      return Result.success(user)
    }
  }
]
