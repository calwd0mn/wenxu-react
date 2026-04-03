import { connectToDatabase } from '../data/db.js'
import { COLLECTION_QUESTION, COLLECTION_QUESTION_COMPONENTS_LIST } from '../constant/dbConfig.js'
import { formatDate } from '../utils/index.js'
import { Result } from '../utils/result.js'
import { ObjectId } from 'mongodb'

const db = await connectToDatabase()
const questionCollection = await db.collection(COLLECTION_QUESTION)
const componentListCollection = await db.collection(COLLECTION_QUESTION_COMPONENTS_LIST)

export default [
  {
    url: '/api/question/list',
    method: 'get',
    response: async ctx => {
      let { title, isStar, isDelete = 0, pageNum = 1, pageSize = 10 } = ctx.query

      const query = {
        isDelete: isDelete === '1' ? 1 : 0,
        title: new RegExp(title || '', 'i')
      }
      if (isStar !== undefined) {
        query.star = { $eq: isStar === 'true' }
      }

      if (typeof pageNum === 'string') {
        pageNum = parseInt(pageNum)
      }
      if (typeof pageSize === 'string') {
        pageSize = parseInt(pageSize)
      }

      const skip = (pageNum - 1) * pageSize
      const limit = pageSize

      const result = await questionCollection.find(query).skip(skip).limit(limit).toArray()

      const total = await questionCollection.countDocuments(query)
      return Result.success({
        list: result,
        total
      })
    }
  },
  {
    url: '/api/question/add',
    method: 'post',
    response: async ctx => {
      if (!ctx.request.body.componentsList || ctx.request.body.componentsList.length === 0) {
        return Result.error().setMsg('组件列表不能为空')
      }
      const result = await questionCollection.insertOne({
        userId: ctx.state.user._id,
        createTime: formatDate(),
        isDelete: 0,
        title: ctx.request.body.title,
        publish: ctx.request.body.publish,
        star: ctx.request.body.star,
        description: ctx.request.body.description,
        jsCode: ctx.request.body.jsCode,
        cssCode: ctx.request.body.cssCode
      })
      if (result.insertedId) {
        const componentsList = ctx.request.body.componentsList.map(comp => {
          if (comp._id) delete comp._id
          return {
            ...comp,
            questionId: result.insertedId.toString()
          }
        })
        await componentListCollection.insertMany(componentsList)
      }
      return Result.success(result)
    }
  },
  {
    url: '/api/question/getInfo',
    method: 'get',
    response: async ctx => {
      const { _id } = ctx.query
      const result = await questionCollection.findOne({
        _id: new ObjectId(_id)
      })
      result.componentsList = await componentListCollection
        .find({
          questionId: _id
        })
        .toArray()
      return Result.success(result)
    }
  },
  {
    url: '/api/question/update',
    method: 'post',
    response: async ctx => {
      try {
        const {
          _id,
          title,
          publish,
          star,
          isDelete,
          description,
          jsCode,
          cssCode,
          componentsList = []
        } = ctx.request.body
        const updateFields = {}
        if (title !== undefined && title !== null) updateFields.title = title
        if (publish !== undefined && publish !== null) updateFields.publish = publish
        if (star !== undefined && star !== null) updateFields.star = star
        if (isDelete !== undefined && isDelete !== null) updateFields.isDelete = isDelete
        if (description !== undefined && description !== null)
          updateFields.description = description
        if (jsCode !== undefined && jsCode !== null) updateFields.jsCode = jsCode
        if (cssCode !== undefined && cssCode !== null) updateFields.cssCode = cssCode
        await questionCollection.updateOne({ _id: new ObjectId(_id) }, { $set: updateFields })
        await componentListCollection.deleteMany({
          questionId: _id
        })
        if (componentsList.length > 0) {
          const newComponentsList = componentsList.map(comp => {
            if (comp._id) delete comp._id
            return {
              ...comp,
              questionId: _id
            }
          })
          await componentListCollection.insertMany(newComponentsList)
        }
        const newInfo = await questionCollection.findOne({
          _id: new ObjectId(_id)
        })
        return Result.success(newInfo)
      } catch (error) {
        return Result.error(error)
      }
    }
  },
  {
    url: '/api/question/delete',
    method: 'delete',
    response: async ctx => {
      const { _id } = ctx.query
      await questionCollection.updateOne({ _id: new ObjectId(_id) }, { $set: { isDelete: 1 } })
      return Result.success({
        _id
      })
    }
  },
  {
    url: '/api/question/restore',
    method: 'put',
    response: async ctx => {
      const { ids } = ctx.request.body
      await questionCollection.updateMany(
        { _id: { $in: ids.map(id => new ObjectId(id)) } },
        { $set: { isDelete: 0 } }
      )
      return Result.success()
    }
  },
  {
    url: '/api/question/remove',
    method: 'put',
    response: async ctx => {
      const { ids } = ctx.request.body
      await questionCollection.deleteMany({
        _id: { $in: ids.map(id => new ObjectId(id)) }
      })
      return Result.success()
    }
  },
  {
    url: '/h5/getComponentsList',
    method: 'get',
    response: async ctx => {
      try {
        const { _id } = ctx.query
        const questionInfo = await questionCollection.findOne({
          _id: new ObjectId(_id)
        })
        const componentsList = await componentListCollection
          .find({
            questionId: _id
          })
          .toArray()
        return Result.success({
          ...questionInfo,
          componentsList
        })
      } catch (error) {
        return Result.error(error)
      }
    }
  }
]
