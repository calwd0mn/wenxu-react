import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Answer, AnswerDocument } from './answer.schema'
import { Model } from 'mongoose'
import { AnswerDto } from './dto/AnswerDto'
import { Result } from 'src/utils/result'

@Injectable()
export class AnswerService {
  constructor(
    @InjectModel(Answer.name)
    private readonly asnwerModel: Model<AnswerDocument>
  ) {}

  async saveAnswer(answer: AnswerDto): Promise<Result<null>> {
    try {
      await this.asnwerModel.create(answer)
      return Result.success(null)
    } catch (error: any) {
      return Result.error().setMsg(error)
    }
  }
}
