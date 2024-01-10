import { Module } from '@nestjs/common';
import { EvaluationService } from './evaluation.service';
import { EvaluationController } from './evaluation.controller';
import { UsersModule } from '../users/users.module';
import { FilmsModule } from '../films/films.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Evaluation } from './entities/evaluation.entity';
import { UserTokenModule } from 'src/user-token/user-token.module';

@Module({
  imports: [
    UsersModule,
    FilmsModule,
    UserTokenModule,
    TypeOrmModule.forFeature([Evaluation]),
  ],
  controllers: [EvaluationController],
  providers: [EvaluationService],
})
export class EvaluationModule {}
