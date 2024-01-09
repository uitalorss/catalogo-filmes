import { Film } from 'src/films/entities/film.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('evaluations')
export class Evaluation {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'int' })
  rating: number;
  @Column({ type: 'text', nullable: true })
  comment: string;
  @ManyToOne(() => User, (user) => user.evaluations, {
    cascade: true,
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
  @ManyToOne(() => Film, (film) => film.evaluations, {
    cascade: true,
  })
  @JoinColumn({ name: 'film_id' })
  film: Film;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
