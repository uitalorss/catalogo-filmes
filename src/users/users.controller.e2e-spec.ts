import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, INestApplication } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions, Repository } from 'typeorm';
import request from 'supertest';
import { AuthModule } from '../auth/auth.module';
import { authGuard } from '../auth/auth.guard';

describe('UsersController', () => {
  let app: INestApplication;
  let module: TestingModule;

  let createUserDto: CreateUserDto;
  let users: User[];

  const dataSourceTest: DataSourceOptions = {
    type: 'postgres',
    host: String('172.22.0.3'),
    port: Number(5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    entities: [User],
  };

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

      expect(res.body).toBeDefined();
    });
  });

  describe('GET /users', () => {
    it('should be able to list a user', async () => {
      const res = await request(app.getHttpServer()).get('/users').expect(200);

      expect(res.body.id).toStrictEqual(users[0].id);
    });
  });
});
