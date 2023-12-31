import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';
import { Exclude } from 'class-transformer';

@Entity('genres')
export class Genre {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;
  @Column({ type: 'text' })
  description: string;
  @ManyToMany(() => Film, (film) => film.genres)
  films: Film[];

  constructor(genre: Partial<Genre>) {
    this.id = genre?.id;
    this.description = genre?.description;
    this.films = genre?.films;
  }
}
