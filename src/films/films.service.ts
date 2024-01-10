import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFilmDto } from './dto/create-film.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Repository } from 'typeorm';
import { Artist } from './entities/artist.entity';
import { Genre } from './entities/genre.entity';
import { ContentRating } from './entities/contentRating.entity';
import { UpdateFilmDTO } from './dto/update-film.dto';
import { searchQueryDto } from './dto/search-query.dto';
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

  public async findAll(query?: searchQueryDto) {
    if (Object.keys(query).length === 0) {
      const films = await this.filmRepository.find({
        relations: {
          artists: true,
          genres: true,
          contentRating: true,
          evaluations: true,
        },
      });
      return films;
    }

    let queryBuilder = this.filmRepository
      .createQueryBuilder('films')
      .leftJoin('films.genres', 'genre')
      .leftJoin('films.artists', 'artist')
      .leftJoinAndSelect('films.evaluations', 'evaluation')
      .leftJoinAndSelect('films.genres', 'genres')
      .leftJoinAndSelect('films.artists', 'artists')
      .leftJoinAndSelect('films.contentRating', 'contentRating');
    if (query.genre) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('films.genres', query.genre)
        .where('genre.description = :description', {
          description: query.genre,
        });
    }

    if (query.artist) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('films.artists', query.artist)
        .andWhere('artist.name = :name', { name: query.artist });
    }

    if (query.contentRating) {
      queryBuilder = queryBuilder
        .leftJoinAndSelect('films.contentRating', query.contentRating)
        .andWhere('contentRating.description = :description', {
          description: query.contentRating,
        });
    }
    const films = await queryBuilder.getMany();

    return films;
  }

  public async findOne(id: string) {
    const film = await this.filmRepository.findOne({
      where: {
        id,
      },
      relations: {
        artists: true,
        genres: true,
        contentRating: true,
        evaluations: true,
      },
    });
    if (!film) {
      throw new NotFoundException('Filme não encontrado.');
    }
    return film;
  }

  public async update(id: string, updateFilmDto: UpdateFilmDTO) {
    const { title } = updateFilmDto;
    const filmAlreadyExists = await this.filmRepository.findOneBy({ title });
    if (!filmAlreadyExists) {
      throw new NotFoundException('Filme não encontrado');
    }
    if (filmAlreadyExists && filmAlreadyExists.title !== updateFilmDto.title) {
      throw new BadRequestException('Nome do filme já incluso na lista');
    }
    const genresList =
      updateFilmDto.genres &&
      (await Promise.all(
        updateFilmDto.genres.map((item) => this.createOrLoadGenres(item)),
      ));

    const artistsList =
      updateFilmDto.artists &&
      (await Promise.all(
        updateFilmDto.artists.map((item) => this.createOrLoadArtists(item)),
      ));

    const nameContentRating =
      updateFilmDto.contentRating &&
      (await this.createOrLoadContentRating(updateFilmDto.contentRating));

    const film = await this.filmRepository.preload({
      id,
      ...updateFilmDto,
      genres: genresList,
      artists: artistsList,
      contentRating: nameContentRating,
    });
    await this.filmRepository.save(film);
  }

  public async remove(id: string) {
    const film = await this.filmRepository.findOneBy({ id });
    if (!film) {
      throw new NotFoundException('Filme não encontrado.');
    }
    await this.filmRepository.remove(film);
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
