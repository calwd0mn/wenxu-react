export class ComponentsDto {
  readonly _id?: string
  readonly name: string
  readonly title: string
  readonly type: string
  readonly props: Record<string, any>
  readonly questionId: string
  readonly isLock: boolean
  readonly isHidden: boolean
}
