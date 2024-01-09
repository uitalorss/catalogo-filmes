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

    // const evaluationAlreadyExists = await this.evaluationRepository.findOne({
    //   where: [
    //     {
    //       user: {
    //         id: user.id,
    //       },
    //     },
    //     {
    //       film: {
    //         id: film.id,
    //       },
    //     },
    //   ],
    //   relations: {
    //     film: true,
    //     user: true,
    //   },
    // });
    // console.log(evaluationAlreadyExists);

    // if (evaluationAlreadyExists) {
    //   throw new BadRequestException({
    //     message: 'Você já atribuiu uma nota para esse filme',
    //   });
    // }

    const evaluation = this.evaluationRepository.create({
      rating,
      comment,
      user,
      film,
    });

    return await this.evaluationRepository.save(evaluation);
  }

  public async delete(id_evaluation: string) {
    const evaluation = await this.evaluationRepository.findOneBy({
      id: id_evaluation,
    });
    if (!evaluation) {
      throw new NotFoundException({ message: 'Avaliação não existe' });
    }

    await this.evaluationRepository.remove(evaluation);
  }
}
