import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { TradeImage } from './trade-image.entity';

export enum TradeCategory {
  TOP = 'TOP',
  BOTTOM = 'BOTTOM',
  OUTER = 'OUTER',
  ETC = 'ETC',
}

export enum TradeStatus {
  ON_SALE = 'ON_SALE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
}

@Entity('trade_posts')
export class TradePost {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column('integer')
  price: number;

  @Column({ type: 'enum', enum: TradeCategory })
  category: TradeCategory;

  @Column({ type: 'enum', enum: TradeStatus, default: TradeStatus.ON_SALE })
  status: TradeStatus;

  @OneToMany(() => TradeImage, (image) => image.post, { cascade: true })
  images: TradeImage[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
