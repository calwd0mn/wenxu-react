import { Inject, Injectable, Request, Scope } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { Question, QuestionDocument } from './question.schema'
import { Result } from 'src/utils/result'
import { FindAllQueryDto } from './dto/FindAllQueryDto'
import { formatDate } from 'src/utils'
import { REQUEST } from '@nestjs/core'
import { UserDto } from 'src/users/dto/UserDto'
import {
  Components,
  ComponentsDocument
} from 'src/components/components.schema'
import { QuestionDto } from './dto/QuestionDto'
import { ComponentsDto } from 'src/components/dto/ComponentsDto'
import { Answer, AnswerDocument } from 'src/answer/answer.schema'
import { AnswerDto } from 'src/answer/dto/AnswerDto'

interface RequestWithUser extends Request {
  user?: UserDto
}

@Injectable({ scope: Scope.REQUEST })
export class QuestionService {
  constructor(
    @InjectModel(Question.name)
    private readonly questionModel: Model<QuestionDocument>,

    @InjectModel(Components.name)
    private readonly componentsModel: Model<ComponentsDocument>,

    @InjectModel(Answer.name)
    private readonly answerModel: Model<AnswerDocument>,

    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  /**
   * @param queryDto
   * @returns
   */
  async findAll(queryDto: FindAllQueryDto) {
    const pageNum = Math.max(Number(queryDto.pageNum) || 1, 1)
    const pageSize = Math.max(Number(queryDto.pageSize) || 10, 1)
    const query: Record<string, any> = {
      isDelete: queryDto.isDelete === '1' ? 1 : 0
    }

    if (queryDto.title?.trim()) {
      query.title = new RegExp(queryDto.title.trim(), 'i')
    }

    if (queryDto.isStar !== undefined) {
      query.star = { $eq: queryDto.isStar === 'true' }
    }
    const [list, total] = await Promise.all([
      this.questionModel
        .find(query)
        .skip((pageNum - 1) * pageSize)
        .limit(pageSize),
      this.questionModel.countDocuments(query)
    ])

    return Result.success({
      list,
      total
    })
  }

  /**
   * @param question
   * @returns
   */
  async addQuestion(question: QuestionDto): Promise<Result<null>> {
    try {
      if (!question.componentsList || question.componentsList.length === 0) {
        return Result.error().setMsg('问卷至少包含一个组件')
      }

      if (!this.request.user?._id) {
        return Result.error().setMsg('用户未登录')
      }

      const newQuestion = {
        userId: this.request.user._id,
        createTime: formatDate(),
        isDelete: 0,
        title: question.title,
        publish: question.publish,
        star: question.star,
        description: question.description,
        jsCode: question.jsCode,
        cssCode: question.cssCode
      }

      const result = (await this.questionModel.create(newQuestion)) as {
        _id: string
      }
      if (result._id) {
        const componentsList = question.componentsList.map(comp => {
          const newComp = { ...comp }
          if (newComp._id) {
            delete newComp._id
          }
          return {
            ...newComp,
            questionId: result._id.toString()
          }
        })
        await this.componentsModel.insertMany(componentsList)
      }
      return Result.success(null)
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }

  /**
   * @param id
   * @returns
   */
  async getQuestionById(id: string): Promise<Result<QuestionDto | null>> {
    const [questionDoc, componentsList] = await Promise.all([
      this.questionModel.findById(id).lean<QuestionDto>(),
      this.componentsModel.find({ questionId: id }).lean<ComponentsDto[]>()
    ])

    if (!questionDoc) {
      return Result.success(null)
    }

    const questionDto: QuestionDto = {
      ...questionDoc,
      componentsList
    }

    return Result.success(questionDto)
  }

  /**
   * @param updateQuestionDto
   * @returns
   */
  async updateQuestion(
    updateQuestionDto: QuestionDto
  ): Promise<Result<QuestionDto | null>> {
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
        componentsList
      } = updateQuestionDto
      const updateFields: Partial<Question> = {}
      if (title !== undefined) updateFields.title = title
      if (publish !== undefined) updateFields.publish = publish
      if (star !== undefined) updateFields.star = star
      if (isDelete !== undefined) updateFields.isDelete = isDelete
      if (description !== undefined) updateFields.description = description
      if (jsCode !== undefined) updateFields.jsCode = jsCode
      if (cssCode !== undefined) updateFields.cssCode = cssCode

      try {
        await this.questionModel.updateOne(
          { _id: _id },
          {
            $set: updateFields
          }
        )
        if (componentsList !== undefined) {
          await this.componentsModel.deleteMany({ questionId: _id })
          const newComponents = componentsList.map(comp => {
            const { _id, ...compWithoutId } = comp
            return {
              ...compWithoutId,
              questionId: updateQuestionDto._id!.toString()
            }
          })

          await this.componentsModel.insertMany(newComponents)
        }
        const updatedQuestion = await this.questionModel
          .findById(_id)
          .lean<QuestionDto>()

        return Result.success(updatedQuestion)
      } catch (error: any) {
        return Result.error().setMsg(error)
      }
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }

  /**
   * @param id
   * @returns
   */
  async deleteQuestion(id: string): Promise<Result<null>> {
    try {
      await this.questionModel.updateOne(
        { _id: id },
        {
          $set: { isDelete: 1 }
        }
      )
      return Result.success(null)
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }

  async restoreQuestion(ids: string[]): Promise<Result<null>> {
    try {
      await this.questionModel.updateMany(
        { _id: { $in: ids } },
        { $set: { isDelete: 0 } }
      )
      return Result.success(null)
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }

  async deleteQuestionCompletely(ids: string[]): Promise<Result<null>> {
    try {
      await this.questionModel.deleteMany({ _id: { $in: ids } })
      return Result.success(null)
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }

  async getAnswerList(
    questionId: string,
    pageNum: string,
    pageSize: string
  ): Promise<Result> {
    try {
      if (!questionId) {
        return Result.error().setMsg('Question ID is required')
      }

      try {
        const query = { questionId: questionId }
        const skip = pageNum
          ? (parseInt(pageNum, 10) - 1) * parseInt(pageSize, 10)
          : 0
        const limit = parseInt(pageSize, 10)
        const total = await this.answerModel.countDocuments(query)

        const answers = await this.answerModel
          .find(query)
          .skip(skip)
          .limit(limit)
          .lean<Answer[]>()

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
        return Result.error().setMsg(JSON.stringify(error))
      }
    } catch (error: any) {
      return Result.error().setMsg(JSON.stringify(error))
    }
  }

  /**
   * @returns
   */
  async getComponentStatistics(
    questionId: string,
    componentId: string,
    name: string
  ): Promise<Result<Array<{ value: string; count: number }>>> {
    try {
      if (!questionId || !componentId) {
        return Result.error().setMsg(
          'Question ID and Component ID are required'
        )
      }
      const query = { questionId: questionId }
      const componentsList = await this.componentsModel
        .find(query)
        .lean<ComponentsDto[]>()
      const componentInfo = componentsList.find(item =>
        new Types.ObjectId(item._id).equals(new Types.ObjectId(componentId))
      )
      if (!componentInfo) {
        return Result.error().setMsg('组件ID不存在')
      }
      const answers = await this.answerModel
        .find({ questionId })
        .lean<AnswerDto[]>()
      const stat = new Map<string, number>()

      for (const answer of answers) {
        const componentAnswer = answer.answers[name]
        if (!componentAnswer) continue

        if (componentInfo.type === 'QuestionCheckbox') {
          const options = componentAnswer.split(',')
          options.forEach(option => {
            const trimmed = option.trim()
            stat.set(trimmed, (stat.get(trimmed) || 0) + 1)
          })
        } else if (componentInfo.type === 'QuestionRadio') {
          stat.set(componentAnswer, (stat.get(componentAnswer) || 0) + 1)
        }
      }
      const result = Array.from(stat.entries()).map(([value, count]) => ({
        value,
        count
      }))

      return Result.success(result)
    } catch (error) {
      return Result.error().setMsg(JSON.stringify(error))
    }
  }

  async getQuestionStatistics(): Promise<Result<any>> {
    try {
      const [questionTotal, published, answered] = await Promise.all([
        this.questionModel.countDocuments({ isDelete: 0 }),
        this.questionModel.countDocuments({ publish: true, isDelete: 0 }),
        this.answerModel.countDocuments()
      ])
      return Result.success({ questionTotal, published, answered })
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }
}
