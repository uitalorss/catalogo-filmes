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
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { EmailModule } from './email.module';

describe('UsersController', () => {
  let app: INestApplication;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        UserTokenModule,
        UsersModule,
        AuthModule,
        EmailModule,
        TypeOrmModule.forRootAsync({
          useFactory: async () => {
            return dataSourceTest;
          },
        }),
        MailerModule.forRoot({
          transport: {
            host: String(process.env.MAIL_HOST),
            port: Number(process.env.MAIL_PORT),
            auth: {
              user: process.env.MAIL_USER,
              pass: process.env.MAIL_PASS,
            },
          },
          defaults: {
            from: `${process.env.MAIL_FROM} <${process.env.MAIL_FROM}>`,
          },
          template: {
            dir: process.cwd() + '/src/templates/',
            adapter: new HandlebarsAdapter(),
            options: {
              strict: true,
            },
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

      console.log(res.status);
    });
  });
});
