import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  description: string;
  @ManyToMany(() => Film, (film) => film.genres)
  films: Film[];
}
