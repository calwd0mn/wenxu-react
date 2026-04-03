import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus
} from '@nestjs/common'
import { Request, Response } from 'express'
import { formatDate } from 'src/utils'

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '服务器内部错误'
    let error = ''

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const res = exception.getResponse() as { message?: string } | string
      message = typeof res === 'string' ? res : res?.message || message
      error = exception.message
    } else if (exception instanceof Error) {
      error = exception.message
    }

    response.status(status).json({
      code: status,
      message,
      error,
      path: request.url,
      timestamp: formatDate()
    })
  }
}
