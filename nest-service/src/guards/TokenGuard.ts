import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException
} from '@nestjs/common'
import { Request } from 'express'
import { JwtService } from '@nestjs/jwt'
import { IS_PUBLIC_KEY } from 'src/metadata/isPublicMetaData'
import { Reflector } from '@nestjs/core'
import { UserDto } from 'src/users/dto/UserDto'

@Injectable()
export class TokenGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ])
    if (isPublic) {
      return true
    }

    const request: Request = context.switchToHttp().getRequest<Request>()

    const token: string | undefined =
      (request.headers['token'] as string) ||
      (request.headers['authorization'] as string)

    if (!token) {
      throw new UnauthorizedException('请求头缺少 Token')
    }

    try {
      const payload = await this.jwtService.verifyAsync<UserDto>(
        token.split(' ')[1],
        {
          secret: process.env.SECRET
        }
      )
      request['user'] = payload
    } catch {
      throw new UnauthorizedException('无效的 Token')
    }

    return true
  }
}
