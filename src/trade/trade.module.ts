import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TradePost } from './trade-post.entity';
import { TradeImage } from './trade-image.entity';
import { TradeService } from './trade.service';
import { TradeController } from './trade.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([TradePost, TradeImage]), AuthModule],
  controllers: [TradeController],
  providers: [TradeService],
})
export class TradeModule {}
