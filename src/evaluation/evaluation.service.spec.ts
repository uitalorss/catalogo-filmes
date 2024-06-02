import { Test, TestingModule } from '@nestjs/testing';
import { EvaluationService } from './evaluation.service';
import { UsersService } from '../users/users.service';
import { mockFilm } from '../films/films.service.spec';
import { mockUser } from '../users/users.service.spec';
import { Evaluation } from './entities/evaluation.entity';
import { randomUUID } from 'crypto';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { FilmsService } from '../films/films.service';
import { CreateEvaluationRequestDto } from './dto/create-evaluation.dto';
import { updateEvaluationRequest } from './dto/update-evaluation.dto';
import { User } from '../users/entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const id = randomUUID();
const idUser = '7b9d6566-b31d-4d87-a260-caf30015287c';

describe('EvaluationService', () => {
  let evaluationService: EvaluationService;
  let evaluationRepository: Repository<Evaluation>;
  let usersService: UsersService;
  let filmsService: FilmsService;

  const mockEvaluation = new Evaluation({
    id,
    rating: 10,
    comment: 'test',
    film: mockFilm,
    user: new User({
      id: idUser,
      name: 'test',
      email: 'test@test.com',
      password: 'test',
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EvaluationService,
        {
          provide: getRepositoryToken(Evaluation),
          useValue: {
            create: jest.fn().mockReturnValue(Promise.resolve(mockEvaluation)),
            findOne: jest.fn().mockReturnValue(Promise.resolve(null)),
            preload: jest.fn().mockReturnValue(Promise.resolve(mockEvaluation)),
            save: jest.fn().mockReturnValue(Promise.resolve(mockEvaluation)),
            update: jest.fn().mockReturnValue(Promise.resolve(mockEvaluation)),
            remove: jest.fn().mockReturnValue(Promise.resolve(mockEvaluation)),
          },
        },
        {
          provide: UsersService,
          useValue: {
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
          },
        },
        {
          provide: FilmsService,
          useValue: {
            findOne: jest.fn().mockReturnValue(Promise.resolve(mockFilm)),
          },
        },
      ],
    }).compile();

    evaluationService = module.get<EvaluationService>(EvaluationService);
    filmsService = module.get<FilmsService>(FilmsService);
    usersService = module.get<UsersService>(UsersService);
    evaluationRepository = module.get<Repository<Evaluation>>(
      getRepositoryToken(Evaluation),
    );
  });

  it('should be defined', () => {
    expect(evaluationService).toBeDefined();
    expect(filmsService).toBeDefined();
    expect(usersService).toBeDefined();
    expect(evaluationRepository).toBeDefined();
  });

  describe('when creating an evaluation', () => {
    const createEvaluation: CreateEvaluationRequestDto = {
      rating: 10,
      comment: 'test',
    };
    it('should be able to do it.', async () => {
      const evaluation = await evaluationService.create({
        comment: createEvaluation.comment,
        rating: createEvaluation.rating,
        user_id: idUser,
        film_id: id,
      });

      expect(filmsService.findOne).toHaveBeenCalled();
      expect(usersService.findOne).toHaveBeenCalled();
      expect(evaluationRepository.findOne).toHaveBeenCalled();
      expect(evaluationRepository.create).toHaveBeenCalled();
      expect(evaluationRepository.save).toHaveBeenCalled();
      expect(evaluation).toStrictEqual(mockEvaluation);
    });

    it('should not be able to create if user has been already evaluated it.', async () => {
      jest
        .spyOn(evaluationRepository, 'findOne')
        .mockReturnValue(Promise.resolve(mockEvaluation));

      expect(
        evaluationService.create({
          comment: createEvaluation.comment,
          rating: createEvaluation.rating,
          user_id: idUser,
          film_id: id,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('when updating an evaluation', () => {
    const updateEvaluation: updateEvaluationRequest = {
      rating: 10,
      comment: 'test',
    };
    it('should be able to do it.', async () => {
      jest
        .spyOn(evaluationRepository, 'findOne')
        .mockReturnValue(Promise.resolve(mockEvaluation));
      const evaluationToUpdate = await evaluationService.update({
        rating: updateEvaluation.rating,
        comment: updateEvaluation.comment,
        user_id: idUser,
        evaluation_id: id,
      });

      expect(evaluationRepository.preload).toHaveBeenCalled();
      expect(evaluationRepository.save).toHaveBeenCalled();
      expect(evaluationToUpdate).toBeUndefined();
    });

    it('should not be able to update if evaluation does not exist.', async () => {
      expect(
        evaluationService.update({
          rating: updateEvaluation.rating,
          comment: updateEvaluation.comment,
          user_id: idUser,
          evaluation_id: id,
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it("should not be able to update if requests user doesn't match to evaluations user.", async () => {
      jest
        .spyOn(evaluationRepository, 'findOne')
        .mockReturnValue(Promise.resolve(mockEvaluation));

      expect(
        evaluationService.update({
          rating: updateEvaluation.rating,
          comment: updateEvaluation.comment,
          user_id: id,
          evaluation_id: id,
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('when deleting an evaluation', () => {
    it('should be able to delete it.', async () => {
      jest
        .spyOn(evaluationRepository, 'findOne')
        .mockReturnValue(Promise.resolve(mockEvaluation));
      const evaluationToDelete = await evaluationService.delete({
        evaluation_id: id,
        user_id: idUser,
      });
      expect(evaluationRepository.findOne).toHaveBeenCalled();
      expect(evaluationRepository.remove).toHaveBeenCalled();
      expect(evaluationToDelete).toBeUndefined();
    });

    it('should not be able to delete if evaluation does not exist', async () => {
      expect(
        evaluationService.delete({ evaluation_id: id, user_id: idUser }),
      ).rejects.toThrow(NotFoundException);
    });

    it("Should not be able to delete if requests user doesn't match to evaluations user", async () => {
      jest
        .spyOn(evaluationRepository, 'findOne')
        .mockReturnValue(Promise.resolve(mockEvaluation));

      expect(
        evaluationService.delete({ evaluation_id: id, user_id: id }),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
