import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Film } from './film.entity';
import { Exclude } from 'class-transformer';

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn('uuid')
  @Exclude()
  id: string;
  @Column({ type: 'text' })
  name: string;
  @ManyToMany(() => Film, (film) => film.artists)
  films: Film[];
}
