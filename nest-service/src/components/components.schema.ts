import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type ComponentsDocument = Components & Document

@Schema({ collection: 'question_components_list' })
export class Components extends Document {
  @Prop({ required: true })
  name: string

  @Prop()
  title: string

  @Prop()
  type: string

  @Prop({ type: Object })
  props: Record<string, any>

  @Prop()
  questionId: string

  @Prop()
  isLock: boolean

  @Prop()
  isHidden: boolean
}

export const ComponentsSchema = SchemaFactory.createForClass(Components)
