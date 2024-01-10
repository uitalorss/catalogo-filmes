import { Test, TestingModule } from '@nestjs/testing';
import { FilmsService } from './films.service';
import { Film } from './entities/film.entity';
import { randomUUID } from 'crypto';
import { Genre } from './entities/genre.entity';
import { Artist } from './entities/artist.entity';
import { ContentRating } from './entities/contentRating.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFilmDto } from './dto/create-film.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateFilmDTO } from './dto/update-film.dto';

const id = randomUUID();

export const mockFilm = new Film({
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

describe('FilmsService', () => {
  let filmService: FilmsService;
  let filmRepository: Repository<Film>;
  let genreRepository: Repository<Genre>;
  let artistRepository: Repository<Artist>;
  let contentRatingRepository: Repository<ContentRating>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(mockFilm),
            create: jest.fn().mockReturnValue(mockFilm),
            save: jest.fn().mockReturnValue(mockFilm),
            find: jest.fn().mockReturnValue([mockFilm]),
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

  describe('when creating a film', () => {
    const createFilmDto: CreateFilmDto = {
      title: 'test',
      synopsis: 'test',
      year: 5,
      duration: 5,
      genres: ['test'],
      artists: ['test'],
      contentRating: 'Livre',
    };
    it('should be able to create it.', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));
      const newFilm = await filmService.create(createFilmDto);

      expect(filmRepository.findOneBy).toHaveBeenCalled();
      expect(filmRepository.create).toHaveBeenCalled();
      expect(filmRepository.save).toHaveBeenCalled();
      expect(newFilm).toStrictEqual(mockFilm);
    });

    it('should be able to create a genre if does not exists', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));
      jest
        .spyOn(genreRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      const newFilm = await filmService.create(createFilmDto);

      expect(genreRepository.create).toHaveBeenCalled();
      expect(newFilm.genres[0]).toStrictEqual(mockFilm.genres[0]);
    });

    it('should be able to create an artist if does not exists', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));
      jest
        .spyOn(artistRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      const newFilm = await filmService.create(createFilmDto);

      expect(artistRepository.create).toHaveBeenCalled();
      expect(newFilm.artists[0]).toStrictEqual(mockFilm.artists[0]);
    });

    it('should be able to create a content rating if does not exists', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));
      jest
        .spyOn(contentRatingRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      const newFilm = await filmService.create(createFilmDto);

      expect(contentRatingRepository.create).toHaveBeenCalled();
      expect(newFilm.contentRating).toStrictEqual(mockFilm.contentRating);
    });

    it('should not be able to do it if film already exists', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(mockFilm));

      expect(filmService.create(createFilmDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // describe('when listing all films', () => {
  //   it('should be able to do it.', async () => {
  //     const films = await filmService.findAll();

  //     expect(filmRepository.find).toHaveBeenCalled();
  //     expect(films).toBeInstanceOf(Array<Film>);
  //   });
  // });

  describe('when getting a film', () => {
    it('should be able to do it.', async () => {
      const film = await filmService.findOne(id);

      expect(filmRepository.findOne).toHaveBeenCalled();
      expect(film).toStrictEqual(mockFilm);
    });

    it('should not be able to get it if does not exist', async () => {
      jest
        .spyOn(filmRepository, 'findOne')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(filmService.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });

  describe('when updating a film', () => {
    const updateFilmDto: UpdateFilmDTO = {
      title: 'test',
      synopsis: 'test',
      year: 5,
      duration: 5,
      genres: ['test'],
      artists: ['test'],
      contentRating: 'Livre',
    };

    it('should be able to update it.', async () => {
      const filmToUpdate = await filmService.update(id, updateFilmDto);

      expect(filmRepository.findOneBy).toHaveBeenCalled();
      expect(filmRepository.preload).toHaveBeenCalled();
      expect(filmRepository.save).toHaveBeenCalled();
      expect(filmToUpdate).toBeUndefined();
    });

    it('should not be able to update it if does not exists', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(filmService.update(id, updateFilmDto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not be able to update it if his title has already used by another film', async () => {
      jest.spyOn(filmRepository, 'findOneBy').mockReturnValueOnce(
        Promise.resolve(
          new Film({
            id,
            title: 'another Test',
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
          }),
        ),
      );

      expect(filmService.update(id, updateFilmDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('when deleting a film', () => {
    it('should be able to delete it.', async () => {
      const filmToDelete = await filmService.remove(id);

      expect(filmRepository.findOneBy).toHaveBeenCalled();
      expect(filmRepository.remove).toHaveBeenCalled();
      expect(filmToDelete).toBeUndefined();
    });

    it('should not be able to delete it if does not exist', async () => {
      jest
        .spyOn(filmRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(filmService.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
