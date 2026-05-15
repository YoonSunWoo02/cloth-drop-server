import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Box } from '../boxes/box.entity';

@Entity('favorites')
@Unique(['userId', 'boxId'])
export class Favorite {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  boxId: string;

  @ManyToOne(() => Box)
  @JoinColumn({ name: 'boxId' })
  box: Box;

  @CreateDateColumn()
  createdAt: Date;
}
