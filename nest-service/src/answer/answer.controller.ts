import { Body, Controller, Post } from '@nestjs/common'
import { AnswerService } from './answer.service'
import { AnswerDto } from './dto/AnswerDto'
import { Public } from 'src/metadata/isPublicMetaData'

@Controller('h5')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  /**
   * @param answer
   */
  @Public()
  @Post('submitAnswer')
  async submitAnswer(@Body() answer: AnswerDto) {
    return this.answerService.saveAnswer(answer)
  }
}
