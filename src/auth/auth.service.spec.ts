import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import { User } from '../users/entities/user.entity';
import { AuthLoginDto } from './dto/auth-login-dto';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  const id = randomUUID();

  const mockUser = new User({
    id,
    name: 'test',
    email: 'test@test.com',
    password: `$2a$08$FI5DwpDnWRnuW1/3bZQ5ROTG6pFJx4JmxM6wMw8h.Dz33mo6ONXHK`,
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockReturnValue({ sub: 'test' }),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('when authenticate a user', () => {
    const authenticateUser: AuthLoginDto = {
      email: 'test@test.com',
      password: 'test',
    };
    it('should be able to do it', async () => {
      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));
      const authenticate = await authService.login(authenticateUser);

      expect(usersService.findByEmail).toHaveBeenCalled();
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(authenticate).toHaveProperty('token');
      bcryptCompareSpy.mockRestore();
    });

    it('should not be able to authenticate if email is wrong', async () => {
      jest
        .spyOn(usersService, 'findByEmail')
        .mockReturnValue(Promise.resolve(null));

      expect(authService.login(authenticateUser)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it("should not be able to authenticate if password doesn't match", async () => {
      const bcryptCompareSpy = jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      expect(
        authService.login({ email: 'test@test.com', password: 'test' }),
      ).rejects.toThrow(UnauthorizedException);
      bcryptCompareSpy.mockRestore();
    });
  });
});
