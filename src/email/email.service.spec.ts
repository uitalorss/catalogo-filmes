import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerService } from '@nestjs-modules/mailer';
import { UsersService } from '../users/users.service';
import { mockUser } from '../users/users.service.spec';
import { UserTokenService } from '../user-token/user-token.service';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';

const token = randomUUID();

describe('EmailService', () => {
  let emailService: EmailService;
  let mailerService: MailerService;
  let usersService: UsersService;
  let userTokenService: UserTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        {
          provide: MailerService,
          useValue: {
            sendMail: jest.fn().mockReturnValue(Promise.resolve()),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
          },
        },
        {
          provide: UserTokenService,
          useValue: {
            generateToken: jest.fn().mockReturnValue(Promise.resolve(token)),
          },
        },
      ],
    }).compile();

    emailService = module.get<EmailService>(EmailService);
    mailerService = module.get<MailerService>(MailerService);
    usersService = module.get<UsersService>(UsersService);
    userTokenService = module.get<UserTokenService>(UserTokenService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
    expect(mailerService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(userTokenService).toBeDefined();
  });

  describe('when sending an email', () => {
    it('Should be able to do it.', async () => {
      const sendMail = await emailService.sendMail({ email: 'test@test.com' });

      expect(usersService.findByEmail).toHaveBeenCalled();
      expect(userTokenService.generateToken).toHaveBeenCalled();
      expect(mailerService.sendMail).toHaveBeenCalled();
      expect(sendMail).toBeUndefined();
    });

    it('should not be able to send email if user does not exist', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(emailService.sendMail({ email: 'test@test.com' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
