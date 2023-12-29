import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: Repository<User>;
  const id = randomUUID();

  const mockUser = new User({
    id,
    name: 'test',
    email: 'test@test.com',
    password: 'test',
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: {
            findOneBy: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
            find: jest.fn().mockReturnValue(Promise.resolve([mockUser])),
            create: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
            remove: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
          },
        },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
    expect(usersRepository).toBeDefined();
  });

  describe('when creating a user', () => {
    const newUser: CreateUserDto = {
      name: 'test',
      email: 'test1@test.com',
      password: 'test',
    };

    it('should be able to create it.', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      const user = await usersService.create(newUser);

      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.create).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
      expect(user).toStrictEqual(mockUser);
    });

    it('should not be able to create it if email already exists', async () => {
      expect(usersService.create(newUser)).rejects.toThrow(BadRequestException);
    });
  });

  describe('when listing all users', () => {
    it('should be able to list it.', async () => {
      const users = await usersService.findAll();

      expect(usersRepository.find).toHaveBeenCalled();
      expect(users).toBeInstanceOf(Array<User>);
    });
  });

  describe('when getting a user', () => {
    it('should be able to get it', async () => {
      const user = await usersService.findOne(id);

      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(user).toStrictEqual(mockUser);
    });

    it('should not be able to get it if does not exists', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(usersService.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });
});
