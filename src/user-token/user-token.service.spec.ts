import { Test, TestingModule } from '@nestjs/testing';
import { UserTokenService } from './user-token.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserToken } from './entities/userToken.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';

describe('UserTokenService', () => {
  let userTokenService: UserTokenService;
  let userTokenRepository: Repository<UserToken>;

  const mockUserToken = new UserToken({
    id: randomUUID(),
    user_id: '123',
    token: randomUUID(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserTokenService,
        {
          provide: getRepositoryToken(UserToken),
          useValue: {
            create: jest.fn().mockReturnValue(mockUserToken),
            save: jest.fn().mockReturnValue(mockUserToken),
            findOneBy: jest.fn().mockReturnValue(mockUserToken),
          },
        },
      ],
    }).compile();

    userTokenService = module.get<UserTokenService>(UserTokenService);
    userTokenRepository = module.get<Repository<UserToken>>(
      getRepositoryToken(UserToken),
    );
  });

  it('should be defined', () => {
    expect(userTokenService).toBeDefined();
  });

  describe('when generating token', () => {
    it('should be able to generate it', async () => {
      const token = await userTokenService.generateToken('123');

      expect(userTokenRepository.create).toHaveBeenCalled();
      expect(userTokenRepository.save).toHaveBeenCalled();
      expect(token).toStrictEqual(mockUserToken);
    });
  });

  describe('when listing a token', () => {
    it('should be able to return it', async () => {
      const token = await userTokenService.findByToken(randomUUID());

      expect(userTokenRepository.findOneBy).toHaveBeenCalled();
      expect(token).toStrictEqual(mockUserToken);
    });
  });
});
