import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Box } from '../boxes/box.entity';
import { User } from '../users/user.entity';

export enum ReportStatus {
  FULL = 'FULL',
  ALMOST_FULL = 'ALMOST_FULL',
  AVAILABLE = 'AVAILABLE',
}

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  boxId: string;

  @ManyToOne(() => Box)
  @JoinColumn({ name: 'boxId' })
  box: Box;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ type: 'enum', enum: ReportStatus })
  status: ReportStatus;

  @Column({ nullable: true })
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;
}
