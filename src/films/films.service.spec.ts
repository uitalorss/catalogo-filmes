import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { randomUUID } from 'crypto';
import { Genre } from './entities/genre.entity';
import { Artist } from './entities/artist.entity';
import { ContentRating } from './entities/contentRating.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

describe('FilmsService', () => {
  let filmService: FilmsService;
  let filmRepository: Repository<Film>;
  let genreRepository: Repository<Genre>;
  let artistRepository: Repository<Artist>;
  let contentRatingRepository: Repository<ContentRating>;

  const id = randomUUID();

  const mockFilm = new Film({
    id,
    title: 'test',
    synopsis: 'test',
    year: 5,
    duration: 5,
    genres: [
      new Genre({
        id,
        description: 'test',
      }),
    ],
    artists: [
      new Artist({
        id,
        name: 'test',
      }),
    ],
    contentRating: new ContentRating({
      id,
      description: 'Livre',
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(mockFilm),
            create: jest.fn().mockReturnValue(mockFilm),
            save: jest.fn().mockReturnValue([mockFilm]),
            find: jest.fn().mockReturnValue(mockFilm),
            findOne: jest.fn().mockReturnValue(mockFilm),
            preload: jest.fn().mockReturnValue(mockFilm),
            remove: jest.fn().mockReturnValue(undefined),
          },
        },
        {
          provide: getRepositoryToken(Genre),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(mockFilm.genres[0]),
            create: jest.fn().mockReturnValue(mockFilm.genres[0]),
          },
        },
        {
          provide: getRepositoryToken(Artist),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(mockFilm.artists[0]),
            create: jest.fn().mockReturnValue(mockFilm.artists[0]),
          },
        },
        {
          provide: getRepositoryToken(ContentRating),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(mockFilm.contentRating),
            create: jest.fn().mockReturnValue(mockFilm.contentRating),
          },
        },
      ],
    }).compile();

    filmService = module.get<FilmsService>(FilmsService);
    filmRepository = module.get<Repository<Film>>(getRepositoryToken(Film));
    genreRepository = module.get<Repository<Genre>>(getRepositoryToken(Genre));
    artistRepository = module.get<Repository<Artist>>(
      getRepositoryToken(Artist),
    );
    contentRatingRepository = module.get<Repository<ContentRating>>(
      getRepositoryToken(ContentRating),
    );
  });

  it('should be defined', () => {
    expect(filmService).toBeDefined();
    expect(filmRepository).toBeDefined();
    expect(genreRepository).toBeDefined();
    expect(artistRepository).toBeDefined();
    expect(contentRatingRepository).toBeDefined();
  });
});
