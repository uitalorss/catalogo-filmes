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
}
