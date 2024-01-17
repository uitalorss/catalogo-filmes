import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { CreateEvaluationRequestDto } from './dto/create-evaluation.dto';
import { authGuard } from '../auth/auth.guard';
import { updateEvaluationDto } from './dto/update-evaluation.dto';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { instanceToInstance } from 'class-transformer';

@ApiTags('Evaluations')
@Controller('films/evaluation')
export class EvaluationController {
  constructor(private readonly evaluationService: EvaluationService) {}

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiBadRequestResponse({
    description: 'Você já atribuiu uma nota para esse filme',
  })
  @Post(':id')
  @UseGuards(authGuard)
  public async create(
    @Req() req,
    @Body()
    createEvaluationRequest: CreateEvaluationRequestDto,
    @Param('id') id: string,
  ) {
    const evaluation = await this.evaluationService.create({
      comment: createEvaluationRequest.comment,
      rating: createEvaluationRequest.rating,
      film_id: id,
      user_id: req.user,
    });
    return instanceToInstance(evaluation);
  }

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiNotFoundResponse({ description: 'Avaliação não existe' })
  @ApiBadRequestResponse({
    description: 'Você não pode atualizar uma avaliação que não é sua.',
  })
  @Put(':id')
  @UseGuards(authGuard)
  @HttpCode(204)
  public async update(
    @Req() req,
    @Param('id') id: string,
    @Body() updaEvaluationDto: updateEvaluationDto,
  ) {
    return await this.evaluationService.update({
      user_id: req.user,
      evaluation_id: id,
      comment: updaEvaluationDto.comment,
      rating: updaEvaluationDto.rating,
    });
  }

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiNotFoundResponse({ description: 'Avaliação não existe' })
  @ApiBadRequestResponse({
    description: 'Você não pode apagar uma avaliação que nao é sua.',
  })
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
