export class Result<T = any> {
  data: T
  code: number
  message: string

  constructor(data: T, code: number, message: string) {
    this.data = data
    this.code = code
    this.message = message
  }

  static success<T = any>(data: T): Result<T> {
    return new Result<T>(data, 200, '成功')
  }

  static error(): Result {
    return new Result(null, 500, '失败')
  }

  setMsg(msg: string): this {
    this.message = msg
    return this
  }

  setCode(code: number): this {
    this.code = code
    return this
  }
}
