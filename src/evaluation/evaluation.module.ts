import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { UsersModule } from 'src/users/users.module';
import { FilmsModule } from 'src/films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from './entities/evaluation.entity';

@Module({
  imports: [UsersModule, FilmsModule, TypeOrmModule.forFeature([Evaluation])],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
