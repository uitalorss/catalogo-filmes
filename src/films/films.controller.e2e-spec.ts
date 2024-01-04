import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { Film } from './entities/film.entity';
import { CreateFilmDto } from './dto/create-film.dto';
import { FilmsModule } from './films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceTest } from '../database/data-source';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { UpdateFilmDTO } from './dto/update-film.dto';

describe('FilmsController', () => {
  let app: INestApplication;
  let module: TestingModule;
  let films: Film[];

  let createFilmDto: CreateFilmDto;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        FilmsModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
      ],
    }).compile();

    createFilmDto = {
      title: 'test',
      synopsis: 'test',
      year: 1909,
      duration: 5,
      genres: ['test'],
      artists: ['test'],
      contentRating: 'Livre',
    };

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(Film);
    films = await repository.find({
      relations: {
        artists: true,
        genres: true,
        contentRating: true,
      },
    });
    await dataSource.destroy();
  });

  afterAll(async () => {
    const dataSource = app.get(DataSource);
    await dataSource.createQueryBuilder().delete().from(Film).execute();
    await module.close();
  });

  describe('POST /films', () => {
    it('should be able to create a film', async () => {
      const res = await request(app.getHttpServer())
        .post('/films')
        .send(createFilmDto)
        .expect(201);

      expect(res.body).toHaveProperty('id');
    });
  });

  describe('GET /films', () => {
    it('should be able to list all films', async () => {
      const res = await request(app.getHttpServer()).get('/films').expect(200);

      expect(res.body).toBeInstanceOf(Array<Film>);
    });
  });

  describe('GET /films/:id', () => {
    it('should be able to get a film by id.', async () => {
      const res = await request(app.getHttpServer())
        .get(`/films/${films[0].id}`)
        .send()
        .expect(200);

      expect(res.body).toHaveProperty('id');
    });
  });

  describe('PUT /films/:id', () => {
    const updateFilmDto: UpdateFilmDTO = {
      title: 'test',
      synopsis: 'another test',
      year: 1909,
      duration: 5,
      genres: ['another test'],
      artists: ['another test'],
      contentRating: 'Livre',
    };
    it('should be able to update a film by id.', async () => {
      const res = await request(app.getHttpServer())
        .put(`/films/${films[0].id}`)
        .send(updateFilmDto)
        .expect(204);

      expect(res.body).toBeTruthy();
    });
  });

  describe('DELETE /films/:id', () => {
    it('should be able to delete a film by id.', async () => {
      const res = await request(app.getHttpServer())
        .del(`/films/${films[0].id}`)
        .expect(204);

      expect(res.body).toBeTruthy();
    });
  });
});
