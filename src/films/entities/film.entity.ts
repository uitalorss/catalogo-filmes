import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('films')
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  title: string;
  @Column({ type: 'integer' })
  year: number;
  @Column({ type: 'integer' })
  duration: number;
  @Column({ type: 'json' })
  genres: string[];
  @Column({ type: 'json' })
  mainActors: string[];
  @Column({ type: 'text' })
  contentRating: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz' })
  updated_at: Date;
}
