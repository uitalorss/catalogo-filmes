import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('ContentRatings')
export class ContentRating {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  description: string;
  @Column()
  acronym: string;
  @OneToMany(() => Film, (film) => film.contentRating)
  films: Film[];
}
