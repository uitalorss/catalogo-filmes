import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Evaluation } from './entities/evaluation.entity';
import { Film } from '../films/entities/film.entity';
import { User } from '../users/entities/user.entity';
import { EvaluationModule } from './evaluation.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceTest } from '../database/data-source';
import { DataSource, Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { FilmsService } from '../films/films.service';
import request from 'supertest';

describe('EvaluationController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let filmRepository: Repository<Film>;
  let userRepository: Repository<User>;
  let usersService: UsersService;
  let filmsService: FilmsService;
  let films: Film[];
  let users: User[];

  beforeAll(async () => {
    module: await Test.createTestingModule({
      imports: [
        EvaluationModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();

    app = module.createNestApplication();
    await app.init();

    filmsService = module.get<FilmsService>(FilmsService);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    filmRepository = dataSource.getRepository(Film);
    userRepository = dataSource.getRepository(User);

    films = await filmRepository.find({
      relations: {
        evaluations: true,
      },
    });

    users = await userRepository.find({
      relations: {
        evaluations: true,
      },
    });
    await dataSource.destroy();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(Evaluation).execute();
    await dataSource.createQueryBuilder().delete().from(Film).execute();
    await dataSource.createQueryBuilder().delete().from(User).execute();
    await module.close();
  });

  describe('POST /films/evaluation/:id', () => {
    beforeAll(async () => {
      await usersService.create({
        name: 'test',
        email: 'test1@test.com',
        password: 'test',
      });

      await filmsService.create({
        title: 'test',
        synopsis: 'test',
        year: 5,
        duration: 5,
        genres: ['test'],
        artists: ['test'],
        contentRating: 'Livre',
      });
    });

    it('Should be able to create an evaluation', async () => {
      const res = await request(app.getHttpServer())
        .post(`/films/evaluation/${films[0].id}`)
        .send({
          comment: 'test',
          rating: 'test',
          user_id: `${users[0].id}`,
          film_id: `${films[0].id}`,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });
  });
});
