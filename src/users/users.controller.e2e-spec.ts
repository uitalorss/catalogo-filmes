import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import request from 'supertest';
import { AuthModule } from '../auth/auth.module';
import { authGuard } from '../auth/auth.guard';
import { UpdateUserDto } from './dto/update-user.dto';
import { dataSourceTest } from '../database/data-source';

describe('UsersController', () => {
  let app: INestApplication;
  let module: TestingModule;

  let createUserDto: CreateUserDto;
  let updateUserDto: UpdateUserDto;
  let users: User[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UsersModule,
        AuthModule,
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
    createUserDto = {
      name: 'test',
      email: 'test@test.com',
      password: 'testtest',
    };

    updateUserDto = {
      name: 'another Test',
    };

    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();
    const repository = dataSource.getRepository(User);
    users = await repository.find();
    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /users', () => {
    it('should be able to create a user', async () => {
      const res = await request(app.getHttpServer())
        .post('/users')
        .send(createUserDto)
        .expect(201);

      expect(res.status).toBe(201);
    });
  });

  describe('GET /users', () => {
    it('should be able to list a user', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);

      expect(res.body.id).toStrictEqual(users[0].id);
      expect(res.status).toBe(200);
    });
  });

  describe('UPDATE /users', () => {
    it('should be able to update a user', async () => {
      const res = await request(app.getHttpServer())
        .put('/users')
        .send(updateUserDto)
        .expect(204);

      expect(res.status).toBe(204);
    });
  });

  describe('DELETE /users', () => {
    it('should be able to delete a user', async () => {
      const res = await request(app.getHttpServer())
        .delete('/users')
        .expect(204);

      expect(res.status).toBe(204);
    });
  });
});
