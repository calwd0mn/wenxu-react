import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type AnswerDocument = Answer & Document

@Schema({ collection: 'question_answer_list' })
export class Answer extends Document {
  @Prop({ required: true, default: '' })
  questionId: string

  @Prop({
    type: Object
  })
  answers: object
}

export const AnswerSchema = SchemaFactory.createForClass(Answer)
