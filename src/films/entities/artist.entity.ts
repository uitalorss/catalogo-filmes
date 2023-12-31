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

  constructor(artist: Partial<Artist>) {
    this.id = artist?.id;
    this.name = artist?.name;
    this.films = artist?.films;
  }
}
