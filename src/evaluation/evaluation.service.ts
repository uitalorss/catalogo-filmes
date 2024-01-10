import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { FilmsService } from 'src/films/films.service';
import { createEvaluationDto } from './dto/create-evaluation.dto';
import { deleteEvaluationDto } from './dto/delete-evaluation.dto';
import { updateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(
    @InjectRepository(Evaluation)
    private evaluationRepository: Repository<Evaluation>,
    private readonly usersService: UsersService,
    private readonly filmsService: FilmsService,
  ) {}

  public async create({
    comment,
    rating,
    user_id,
    film_id,
  }: createEvaluationDto) {
    const film = await this.filmsService.findOne(film_id);
    const user = await this.usersService.findOne(user_id);

    const evaluationAlreadyExists = await this.evaluationRepository.findOne({
      where: {
        user: {
          id: user.id,
        },
        film: {
          id: film.id,
        },
      },
      relations: {
        film: true,
        user: true,
      },
    });
    if (evaluationAlreadyExists) {
      throw new BadRequestException({
        message: 'Você já atribuiu uma nota para esse filme',
      });
    }

    const evaluation = this.evaluationRepository.create({
      rating,
      comment,
      user,
      film,
    });

    return await this.evaluationRepository.save(evaluation);
  }

  public async update({
    rating,
    comment,
    user_id,
    evaluation_id,
  }: updateEvaluationDto) {
    const evaluation = await this.evaluationRepository.preload({
      id: evaluation_id,
      user: {
        id: user_id,
      },
      comment,
      rating,
    });

    if (!evaluation) {
      throw new NotFoundException({ message: 'Avaliação não existe' });
    }

    if (evaluation.user.id !== user_id) {
      throw new BadRequestException({
        message: 'Você não pode atualizar uma avaliação que não é sua.',
      });
    }

    await this.evaluationRepository.save(evaluation);
  }

  public async delete({ evaluation_id, user_id }: deleteEvaluationDto) {
    const evaluation = await this.evaluationRepository.findOne({
      where: { id: evaluation_id },
      relations: {
        user: true,
      },
    });
    if (!evaluation) {
      throw new NotFoundException({ message: 'Avaliação não existe' });
    }

    if (evaluation.user.id !== user_id) {
      throw new BadRequestException(
        'Você não pode apagar uma avaliação que nao é sua.',
      );
    }

    await this.evaluationRepository.remove(evaluation);
  }
}
