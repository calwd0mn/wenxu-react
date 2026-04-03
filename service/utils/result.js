export class Result {
  constructor(data, code, message) {
    this.data = data
    this.code = code
    this.message = message
  }

  static success(data) {
    return new Result(data, 200, '成功')
  }

  static error(data = '') {
    return new Result(data.toString(), 500, '失败')
  }

  setMsg(msg) {
    this.message = msg
    return this
  }

  setCode(code) {
    this.code = code
    return this
  }
}
