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

  constructor(userToken: Partial<UserToken>) {
    this.id = userToken?.id;
    this.user_id = userToken?.user_id;
    this.token = userToken?.token;
    this.created_at = userToken?.created_at;
  }
}
