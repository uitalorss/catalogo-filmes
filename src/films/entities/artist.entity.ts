import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';

@Entity('Artist')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  name: string;

  @ManyToMany(() => Film, (film) => film.artists)
  films: Film[];
}
