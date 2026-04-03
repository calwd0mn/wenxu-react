import { connectToDatabase } from '../data/db.js'
import {
  COLLECTION_QUESTION_COMPONENTS_LIST,
  COLLECTION_QUESTION_ANSWER_LIST
} from '../constant/dbConfig.js'
import { Result } from '../utils/result.js'

const db = await connectToDatabase()
const componentCollection = await db.collection(
  COLLECTION_QUESTION_COMPONENTS_LIST
)
const answerCollection = await db.collection(COLLECTION_QUESTION_ANSWER_LIST)

export default [
  {
    url: '/api/question/getAnswerList',
    method: 'get',
    response: async ctx => {
      const { questionId, pageNum = 1, pageSize = 10 } = ctx.query

      if (!questionId) {
        return Result.error('Question ID is required')
      }

      try {
        const query = { questionId: questionId }
        const skip = (pageNum - 1) * pageSize
        const limit = parseInt(pageSize, 10)
        const total = await answerCollection.countDocuments(query)
        const answers = await answerCollection
          .find(query)
          .skip(skip)
          .limit(limit)
          .toArray()

        const rows = answers.map(answer => {
          const { _id, questionId, answers } = answer
          return {
            _id,
            questionId,
            ...answers
          }
        })

        return Result.success({
          total,
          pageNum: parseInt(pageNum, 10),
          pageSize: limit,
          rows
        })
      } catch (error) {
        return Result.error('Failed to fetch answer list').setMsg(
          JSON.stringify(error)
        )
      }
    }
  },
  {
    url: '/api/question/stat',
    method: 'get',
    response: async ctx => {
      try {
        const { questionId, componentId, name } = ctx.query

        if (!questionId || !componentId) {
          return Result.error('Question ID and Component ID are required')
        }
        const query = { questionId: questionId }
        const componentsList = await componentCollection.find(query).toArray()
        const componentInfo = componentsList.find(
          item => item._id.toString() === componentId
        )
        if (!componentInfo) {
          return Result.error().setMsg('组件ID不存在')
        }
        const answerList = await answerCollection.find(query).toArray()
        const stat = {}
        for (const answer of answerList) {
          const componentAnswer = answer.answers[name]
          if (componentInfo.type === 'QuestionCheckbox') {
            const options = componentAnswer.split(',')
            options.forEach(option => {
              stat[option.trim()] = (stat[option.trim()] || 0) + 1
            })
          } else if (componentInfo.type === 'QuestionRadio') {
            stat[componentAnswer] = (stat[componentAnswer] || 0) + 1
          }
        }
        const result = Object.entries(stat).map(([value, count]) => ({
          value,
          count
        }))
        return Result.success(result)
      } catch (error) {
        return Result.error(
          'Failed to fetch answer list',
          JSON.stringify(error)
        )
      }
    }
  },
  {
    url: '/h5/submitAnswer',
    method: 'post',
    response: async ctx => {
      const { questionId, answers } = ctx.request.body

      if (!questionId) return Result.error('问卷ID不能为空')
      try {
        const res = await answerCollection.insertOne({
          questionId: questionId,
          answers: answers
        })
        return Result.success(res)
      } catch (error) {
        return Result.error(error)
      }
    }
  }
]
