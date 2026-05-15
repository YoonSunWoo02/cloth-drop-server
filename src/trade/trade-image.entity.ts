import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TradePost } from './trade-post.entity';

@Entity('trade_images')
export class TradeImage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  postId: string;

  @ManyToOne(() => TradePost, (post) => post.images, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  post: TradePost;

  @Column()
  imageUrl: string;

  @Column('integer')
  order: number;
}
