import { ComponentsDto } from 'src/components/dto/ComponentsDto'

export class QuestionDto {
  readonly _id?: string
  readonly userId: string
  readonly title: string
  readonly publish: boolean
  readonly star: boolean
  readonly createTime: string
  readonly isDelete: number
  readonly description: string
  readonly jsCode: string
  readonly cssCode: string
  public componentsList: ComponentsDto[]
}
