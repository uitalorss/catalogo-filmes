import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationRequest } from './dto/create-evaluation.dto';
import { authGuard } from 'src/auth/auth.guard';

@Controller('films/evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @Post(':id')
  @UseGuards(authGuard)
  public async create(
    @Req() req,
    @Body()
    createEvaluationRequest: CreateEvaluationRequest,
    @Param('id') id: string,
  ) {
    const evaluation = await this.evaluationService.create({
      comment: createEvaluationRequest.comment,
      rating: createEvaluationRequest.rating,
      film_id: id,
      user_id: req.user,
    });
    return evaluation;
  }

  @Delete(':id')
  @UseGuards(authGuard)
  @HttpCode(204)
  public async delete(@Req() req, @Param('id') id: string) {
    return await this.evaluationService.delete({
      user_id: req.user,
      evaluation_id: id,
    });
  }
}
