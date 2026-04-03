import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Scope
} from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserDocument } from './users.schema'
import { Model } from 'mongoose'
import { JwtService } from '@nestjs/jwt'
import { formatDate } from 'src/utils'
import { UserDto } from './dto/UserDto'
import { REQUEST } from '@nestjs/core'

interface RequestWithUser extends Request {
  user?: UserDto
}
@Injectable({ scope: Scope.REQUEST })
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private jwtService: JwtService,
    @Inject(REQUEST) private readonly request: RequestWithUser
  ) {}

  async login(userInfo: UserDto): Promise<string> {
    const userName = String(userInfo.userName || '').trim()
    const passWord = String(userInfo.passWord || '').trim()

    const user = await this.userModel.findOne({ userName }).lean<UserDocument>()
    if (!user) {
      throw new HttpException('用户不存在', HttpStatus.BAD_REQUEST)
    }
    if (user.passWord !== passWord) {
      throw new HttpException('密码错误', HttpStatus.BAD_REQUEST)
    }
    const payload = {
      userName: user.userName,
      _id: user._id?.toString?.() || String(user._id)
    }

    return this.jwtService.signAsync(payload)
  }

  async register(userInfo: UserDto) {
    const userName = String(userInfo.userName || '').trim()
    const passWord = String(userInfo.passWord || '').trim()

    const user = await this.userModel.findOne({ userName }).lean<UserDocument>()
    if (user) {
      throw new HttpException('用户已存在', HttpStatus.BAD_REQUEST)
    }
    await this.userModel.create({
      userName,
      passWord,
      createTime: formatDate()
    })
  }

  async getUserInfo() {
    const userInfo = await this.userModel.findById(this.request.user?._id)
    return userInfo
  }
}
