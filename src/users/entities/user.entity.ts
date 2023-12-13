import { Exclude } from 'class-transformer';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  name: string;
  @Column({ type: 'text' })
  email: string;
  @Column({ type: 'text' })
  @Exclude()
  password: string;
  @CreateDateColumn({ type: 'timestamptz', default: 'now()' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz', default: 'now()' })
  updated_at: string;
}
