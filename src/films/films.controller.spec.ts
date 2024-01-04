import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Film } from './entities/film.entity';
import { Genre } from './entities/genre.entity';
import { Artist } from './entities/artist.entity';
import { ContentRating } from './entities/contentRating.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        FilmsService,
        {
          provide: getRepositoryToken(Film),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Genre),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Artist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ContentRating),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
