import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
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
import { authGuard } from '../auth/auth.guard';

describe('EvaluationController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let filmRepository: Repository<Film>;
  let userRepository: Repository<User>;
  let evaluationRepository: Repository<Evaluation>;
  let usersService: UsersService;
  let filmsService: FilmsService;
  let evaluations: Evaluation[];
  let films: Film[];
  let users: User[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        EvaluationModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    })
      .overrideGuard(authGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = users[0].id;
          return true;
        },
      })
      .compile();

    app = module.createNestApplication();
    await app.init();

    filmsService = module.get<FilmsService>(FilmsService);
    usersService = module.get<UsersService>(UsersService);
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    filmRepository = dataSource.getRepository(Film);
    userRepository = dataSource.getRepository(User);
    evaluationRepository = dataSource.getRepository(Evaluation);

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

    evaluations = await evaluationRepository.find();

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
        name: 'teste pra ser feito',
        email: 'test1@test.com',
        password: 'testtesst',
      });

      await filmsService.create({
        title: 'teste pra ser feito',
        synopsis: 'teste pra ser feito',
        year: 1909,
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
          rating: 10,
          user_id: `${users[0].id}`,
          film_id: `${films[0].id}`,
        })
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /films/evaluation/:id', () => {
    it('Should be able to update an evaluation', async () => {
      await request(app.getHttpServer())
        .put(`/films/evaluation/${evaluations[0].id}`)
        .send({
          comment: 'update Test',
          rating: 9,
          user_id: users[0].id,
          evaluation_id: evaluations[0].id,
        })
        .expect(204);
    });
  });

  describe('DELETE /films/evaluation/:id', () => {
    it('Should be able to delete an evaluation', async () => {
      await request(app.getHttpServer())
        .delete(`/films/evaluation/${evaluations[0].id}`)
        .send({ user_id: users[0].id, evaluation_id: evaluations[0].id })
        .expect(204);
    });
  });
});
