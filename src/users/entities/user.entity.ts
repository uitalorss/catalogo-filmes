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
  password: string;
  @CreateDateColumn({ type: 'timestamptz', default: 'now()' })
  created_at: Date;
  @UpdateDateColumn({ type: 'timestamptz', default: 'now()' })
  updated_at: string;
}
