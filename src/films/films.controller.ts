import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpCode,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto, createFilmSchema } from './dto/create-film.dto';
import { instanceToInstance } from 'class-transformer';
import { ZodValidationPipe } from '../helpers/ZodValidationPipe';
import { UpdateFilmDTO, partialFilmSchema } from './dto/update-film.dto';
import { searchQueryDto, searchQuerySchema } from './dto/search-query.dto';
import { authGuard } from '../auth/auth.guard';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ResponseFilmDto } from './dto/response-film.dto';

@ApiTags('Films')
@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiBadRequestResponse({ description: 'Esse filme já existe.' })
  @UseGuards(authGuard)
  @Post()
  @HttpCode(201)
  public async create(
    @Res() res,
    @Body(new ZodValidationPipe(createFilmSchema)) createFilmDto: CreateFilmDto,
  ): Promise<ResponseFilmDto> {
    const film = await this.filmsService.create(createFilmDto);
    return res.json(film);
  }

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @UseGuards(authGuard)
  @Get()
  public async findAll(
    @Query(new ZodValidationPipe(searchQuerySchema)) query: searchQueryDto,
    @Res() res,
  ): Promise<ResponseFilmDto[]> {
    const films = await this.filmsService.findAll(query);

    return res.json(instanceToInstance(films));
  }

  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiNotFoundResponse({ description: 'Filme não encontrado.' })
  @UseGuards(authGuard)
  @Get(':id')
  public async findOne(
    @Res() res,
    @Param('id') id: string,
  ): Promise<ResponseFilmDto> {
    const film = await this.filmsService.findOne(id);
    return res.json(instanceToInstance(film));
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiNotFoundResponse({ description: 'Filme não encontrado.' })
  @ApiBadRequestResponse({ description: 'Nome do filme já incluso na lista' })
  @UseGuards(authGuard)
  @HttpCode(204)
  @Put(':id')
  update(
    @Res() res,
    @Body(new ZodValidationPipe(partialFilmSchema))
    updateFilmDto: UpdateFilmDTO,
    @Param('id') id: string,
  ) {
    this.filmsService.update(id, updateFilmDto);
    return res.send();
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse({ description: 'Sessão inválida' })
  @ApiNotFoundResponse({ description: 'Filme não encontrado.' })
  @UseGuards(authGuard)
  @HttpCode(204)
  @Delete(':id')
  public async remove(@Res() res, @Param('id') id: string) {
    await this.filmsService.remove(id);
    return res.send();
  }
}
