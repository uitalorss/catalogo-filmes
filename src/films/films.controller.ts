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
  UseGuards,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto, createFilmSchema } from './dto/create-film.dto';
import { instanceToInstance } from 'class-transformer';
import { ZodValidationPipe } from '../users/helpers/ZodValidationPipe';
import { UpdateFilmDTO, partialFilmSchema } from './dto/update-film.dto';
import { authGuard } from '../auth/auth.guard';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @HttpCode(201)
  public async create(
    @Res() res,
    @Body(new ZodValidationPipe(createFilmSchema)) createFilmDto: CreateFilmDto,
  ) {
    const film = await this.filmsService.create(createFilmDto);
    return res.json(film);
  }

  @Get()
  public async findAll(@Res() res) {
    const films = await this.filmsService.findAll();

    return res.json(instanceToInstance(films));
  }

  @UseGuards(authGuard)
  @Get(':id')
  public async findOne(@Res() res, @Param('id') id: string) {
    const film = await this.filmsService.findOne(id);
    return res.json(instanceToInstance(film));
  }

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

  @HttpCode(204)
  @Delete(':id')
  public async remove(@Res() res, @Param('id') id: string) {
    await this.filmsService.remove(id);
    return res.send();
  }
}
