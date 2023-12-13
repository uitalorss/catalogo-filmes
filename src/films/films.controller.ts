import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Res,
  HttpCode,
} from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/create-film.dto';
import { instanceToInstance } from 'class-transformer';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  public async create(@Res() res, @Body() createFilmDto: CreateFilmDto) {
    const film = await this.filmsService.create(createFilmDto);
    return res.json(film);
  }

  @Get()
  public async findAll(@Res() res) {
    const films = await this.filmsService.findAll();

    return res.json(instanceToInstance(films));
  }

  @Get(':id')
  public async findOne(@Res() res, @Param('id') id: string) {
    const film = await this.filmsService.findOne(id);
    return res.json(instanceToInstance(film));
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFilmDto: UpdateFilmDto) {
  //   return this.filmsService.update(+id, updateFilmDto);
  // }

  @HttpCode(204)
  @Delete(':id')
  public async remove(@Res() res, @Param('id') id: string) {
    await this.filmsService.remove(id);
    return res.send();
  }
}
