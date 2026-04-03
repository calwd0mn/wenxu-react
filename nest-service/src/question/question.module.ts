import { Module } from '@nestjs/common'
import { QuestionController } from './question.controller'
import { QuestionService } from './question.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Question, QuestionSchema } from './question.schema'
import { Components, ComponentsSchema } from 'src/components/components.schema'
import { Answer, AnswerSchema } from 'src/answer/answer.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Question.name, schema: QuestionSchema },
      { name: Components.name, schema: ComponentsSchema },
      { name: Answer.name, schema: AnswerSchema }
    ])
  ],
  controllers: [QuestionController],
  providers: [QuestionService]
})
export class QuestionModule {}
