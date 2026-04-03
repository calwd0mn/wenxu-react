import { Body, Controller, Delete, Get, Post, Put, Query } from '@nestjs/common'
import { QuestionService } from './question.service'
import { FindAllQueryDto } from './dto/FindAllQueryDto'
import { QuestionDto } from './dto/QuestionDto'
import { Public } from 'src/metadata/isPublicMetaData'

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @Get('list')
  findAll(@Query() query: FindAllQueryDto) {
    return this.questionService.findAll(query)
  }

  @Post('add')
  addQuestion(@Body() question: QuestionDto) {
    return this.questionService.addQuestion(question)
  }

  @Public()
  @Get('getInfo')
  getQuestionInfo(@Query() _id: string) {
    return this.questionService.getQuestionById(_id)
  }

  @Post('update')
  updateQuestion(@Body() question: QuestionDto) {
    return this.questionService.updateQuestion(question)
  }

  @Delete('delete')
  deleteQuestion(@Query() _id: string) {
    return this.questionService.deleteQuestion(_id)
  }

  @Put('restore')
  restoreQuestion(@Body() { ids }: { ids: string[] }) {
    console.log(ids)
    return this.questionService.restoreQuestion(ids)
  }

  @Put('remove')
  deleteQuestionCompletely(@Body() { ids }: { ids: string[] }) {
    return this.questionService.deleteQuestionCompletely(ids)
  }

  @Get('getAnswerList')
  getAnswerList(
    @Query('questionId') questionId: string,
    @Query('pageNum') pageNum: string = '1',
    @Query('pageSize') pageSize: string = '10'
  ) {
    return this.questionService.getAnswerList(questionId, pageNum, pageSize)
  }

  @Get('stat')
  async getComponentStatistics(
    @Query('questionId') questionId: string,
    @Query('componentId') componentId: string,
    @Query('name') name: string
  ) {
    return this.questionService.getComponentStatistics(
      questionId,
      componentId,
      name
    )
  }

  @Get('getQuestionStatistics')
  async getQuestionStatistics() {
    return this.questionService.getQuestionStatistics()
  }
}
