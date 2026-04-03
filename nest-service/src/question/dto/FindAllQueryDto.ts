export class FindAllQueryDto {
  public readonly title?: string
  public readonly isStar?: string
  public readonly isDelete?: string
  public readonly pageNum: string = '1'
  public readonly pageSize: string = '10'
}
