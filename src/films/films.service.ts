import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { Genre } from './entities/genre.entity';
import { ContentRating } from './entities/contentRating.entity';
// import { UpdateFilmDto } from './dto/update-film.dto';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,

    @InjectRepository(Genre)
    private genreRepository: Repository<Genre>,

    @InjectRepository(Artist)
    private artistRepository: Repository<Artist>,

    @InjectRepository(ContentRating)
    private contentRatingRepository: Repository<ContentRating>,
  ) {}
  public async create({
    title,
    synopsis,
    year,
    duration,
    genres,
    artists,
    contentRating,
  }: CreateFilmDto) {
    const filmAlreadyExists = await this.filmRepository.findOneBy({ title });
    if (filmAlreadyExists) {
      throw new BadRequestException('Esse filme já existe.');
    }
    const artistsList = await Promise.all(
      artists.map((item) => this.createOrLoadArtists(item)),
    );

    const genresList = await Promise.all(
      genres.map((item) => this.createOrLoadGenres(item)),
    );
    const nameContentRating =
      await this.createOrLoadContentRating(contentRating);

    const film = this.filmRepository.create({
      title,
      synopsis,
      year,
      duration,
      genres: genresList,
      artists: artistsList,
      contentRating: nameContentRating,
    });

    await this.filmRepository.save(film);
    return film;
  }

  findAll() {
    return `This action returns all films`;
  }

  findOne(id: number) {
    return `This action returns a #${id} film`;
  }

  // update(id: number, updateFilmDto: UpdateFilmDto) {
  //   return `This action updates a #${id} film`;
  // }

  remove(id: number) {
    return `This action removes a #${id} film`;
  }

  private async createOrLoadArtists(name: string) {
    const artist = await this.artistRepository.findOneBy({
      name,
    });
    if (artist) {
      return artist;
    }
    return this.artistRepository.create({ name });
  }

  private async createOrLoadGenres(genreDescription: string) {
    const genre = await this.genreRepository.findOneBy({
      description: genreDescription,
    });
    if (genre) {
      return genre;
    }
    return this.genreRepository.create({ description: genreDescription });
  }

  private async createOrLoadContentRating(nameContentRating: string) {
    const contentRating = await this.contentRatingRepository.findOneBy({
      description: nameContentRating,
    });
    if (contentRating) {
      return contentRating;
    }
    return this.contentRatingRepository.create({
      description: nameContentRating,
    });
  }
}
