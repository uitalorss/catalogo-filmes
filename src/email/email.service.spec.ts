import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { UserTokenService } from '../user-token/user-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { UserToken } from '../user-token/entities/userToken.entity';
import { Repository } from 'typeorm';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        MailerService,
        UsersService,
        UserTokenService,
        {
          provide: 'MAILER_OPTIONS',
          useValue: {
            transport: {
              host: 'localhost',
              port: 1025,
              ignoreTLS: true,
            },
          },
        },
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(UserToken),
          useClass: Repository,
        },
        // outros serviços que EmailService depende
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
