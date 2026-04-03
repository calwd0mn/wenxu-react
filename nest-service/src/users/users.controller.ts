import { Body, Controller, Get, Post, Query } from '@nestjs/common'
import { UsersService } from './users.service'
import { Result } from 'src/utils/result'
import { Public } from 'src/metadata/isPublicMetaData'
import { UserDto } from './dto/UserDto'

@Controller('system')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Public()
  @Post('login')
  async login(@Body() userInfo: UserDto): Promise<Result<any>> {
    const token = await this.userService.login(userInfo)
    return Result.success({ token })
  }

  @Public()
  @Post('register')
  async register(@Body() userInfo: UserDto): Promise<Result<null>> {
    await this.userService.register(userInfo)
    return Result.success(null)
  }

  @Get('userInfo')
  async getUserInfo(): Promise<Result<any>> {
    const userInfo = await this.userService.getUserInfo()
    return Result.success(userInfo)
  }
}
