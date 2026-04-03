import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule } from '@nestjs/config'
import { QuestionModule } from './question/question.module'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { TokenGuard } from './guards/TokenGuard'
import { APP_FILTER, APP_GUARD } from '@nestjs/core'
import { AllExceptionsFilter } from './exception/AllExceptionsFilter'
import { ComponentsModule } from './components/components.module'
import { AnswerModule } from './answer/answer.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URL}`),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '72h' }
    }),
    QuestionModule,
    UsersModule,
    ComponentsModule,
    AnswerModule,
    AiModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: TokenGuard
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter
    }
  ]
})
export class AppModule {}
