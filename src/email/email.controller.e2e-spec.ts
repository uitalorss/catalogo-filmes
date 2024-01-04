import 'dotenv/config';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { UserTokenModule } from '../user-token/user-token.module';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AuthModule } from '../auth/auth.module';
import { dataSourceTest } from '../database/data-source';

describe('UsersController', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserTokenModule,
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
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource(dataSourceTest).initialize();

    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  describe('POST /email', () => {
    it('should be able to generate a token and send email', async () => {
      const res = await request(app.getHttpServer())
        .post('/email')
        .send({ email: 'test@test.com' })
        .expect(201);

      console.log(res.body);

      expect(res.status).toBe(201);
    });
  });
});
