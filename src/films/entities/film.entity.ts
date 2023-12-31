import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Genre } from './genre.entity';
import { Artist } from './artist.entity';
import { ContentRating } from './contentRating.entity';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  synopsis: string;

  @Column({ type: 'integer' })
  year: number;

  @Column({ type: 'integer' })
  duration: number;

  @ManyToMany(() => Genre, (genre) => genre.films, {
    cascade: true,
  })
  @JoinTable()
  genres: Genre[];

  @ManyToMany(() => Artist, (artist) => artist.films, {
    cascade: true,
  })
  @JoinTable()
  artists: Artist[];

  @ManyToOne(() => ContentRating, (contentRating) => contentRating.films, {
    cascade: true,
  })
  @JoinColumn({ name: 'ContentRating_id' })
  contentRating: ContentRating;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;

  constructor(film: Partial<Film>) {
    this.id = film?.id;
    this.title = film?.title;
    this.synopsis = film?.synopsis;
    this.year = film?.year;
    this.duration = film?.duration;
    this.genres = film?.genres;
    this.artists = film?.artists;
    this.contentRating = film?.contentRating;
    this.created_at = film?.created_at;
    this.updated_at = film?.updated_at;
  }
}
