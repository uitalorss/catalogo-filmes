import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { randomUUID } from 'crypto';
import { CreateUserDto } from './dto/create-user.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

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
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
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

    it('should be able to get it by email', async () => {
      const user = await usersService.findByEmail('test@test.com');

      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(user).toStrictEqual(mockUser);
    });

    it('should not be able to get it if does not exists', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(usersService.findOne(id)).rejects.toThrow(NotFoundException);
    });

    it('should not be able to get it if email does not exists', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(usersService.findByEmail('test@test.com')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('when updating a user', () => {
    const updateUser: UpdateUserDto = {
      name: 'test',
      email: 'test1@test.com',
      password: 'test',
    };
    it('should be able to update it', async () => {
      const userToUpdate = await usersService.update(id, updateUser);

      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.save).toHaveBeenCalled();
      expect(userToUpdate).toStrictEqual(mockUser);
    });

    it('should not be able to update it if does not exist.', async () => {
      jest
        .spyOn(usersRepository, 'findOneBy')
        .mockReturnValueOnce(Promise.resolve(null));

      expect(usersService.update(id, updateUser)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should not be able to update it if email has already used by another user', async () => {
      jest.spyOn(usersRepository, 'findOne').mockReturnValueOnce(
        Promise.resolve(
          new User({
            id,
            name: 'test',
            email: 'test2@test.com',
            password: 'test',
          }),
        ),
      );
      expect(usersService.update(id, updateUser)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('when deleting a user', () => {
    it('should be able to delete it  if does not exists', async () => {
      const userToDelete = await usersService.remove(id);

      expect(usersRepository.findOneBy).toHaveBeenCalled();
      expect(usersRepository.remove).toHaveBeenCalled();
      expect(userToDelete).toBeUndefined();
    });

    it('should not be able to delete it', async () => {
      jest.spyOn(usersRepository, 'findOneBy').mockReturnValueOnce(null);

      expect(usersService.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
