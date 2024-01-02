import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersModule } from './users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import request from 'supertest';
import { AuthModule } from '../auth/auth.module';

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

  beforeEach(async () => {
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
    }).compile();

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

      console.log(res.body);
      expect(res.body).toBeDefined();
    });
  });
});
