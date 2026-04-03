import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ collection: 'userlist' })
export class User extends Document {
  @Prop({ required: true })
  userName: string

  @Prop()
  passWord: string

  @Prop()
  createTime: string
}

export const UserSchema = SchemaFactory.createForClass(User)
