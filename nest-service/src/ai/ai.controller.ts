import { Body, Controller, Post } from '@nestjs/common'
import { AiService } from './ai.service'
import { Result } from 'src/utils/result'
import { GenerateQuestionDto, OptimizeComponentDto } from './dto/ai-question.dto'

@Controller('ai/question')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  async generate(@Body() body: GenerateQuestionDto) {
    try {
      const data = await this.aiService.generateQuestion(
        body.messages || [],
        body.currentPageInfo || {},
        body.currentComponentsList || []
      )
      return Result.success(data)
    } catch (error: any) {
      return Result.error().setMsg(error.message || 'AI 生成失败')
    }
  }

  @Post('optimize-component')
  async optimizeComponent(@Body() body: OptimizeComponentDto) {
    try {
      const data = await this.aiService.optimizeComponent(
        body.messages || [],
        body.currentComponent || {},
        body.pageTitle || '',
        body.pageDescription || ''
      )
      return Result.success(data)
    } catch (error: any) {
      return Result.error().setMsg(error.message || 'AI 优化失败')
    }
  }
}
