import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type QuestionDocument = Question & Document

@Schema({ collection: 'question' })
export class Question extends Document {
  @Prop()
  userId: string

  @Prop({ required: true })
  title: string

  @Prop()
  publish: boolean

  @Prop()
  star: boolean

  @Prop()
  createTime: string

  @Prop({ default: 0 })
  isDelete: number

  @Prop()
  description: string

  @Prop()
  jsCode: string

  @Prop()
  cssCode: string
}

export const QuestionSchema = SchemaFactory.createForClass(Question)
