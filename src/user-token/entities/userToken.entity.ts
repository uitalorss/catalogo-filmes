import {
  Column,
  CreateDateColumn,
  Entity,
  Generated,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('userToken')
export class UserToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'text' })
  user_id: string;
  @Column({ type: 'text' })
  @Generated('uuid')
  token: string;
  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;
}
