import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('contentRatings')
export class ContentRating {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  description: string;
  @OneToMany(() => Film, (film) => film.contentRating)
  films: Film[];
}
