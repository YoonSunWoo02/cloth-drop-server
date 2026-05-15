import { IsEnum } from 'class-validator';
import { TradeStatus } from '../trade-post.entity';

export class UpdateStatusDto {
  @IsEnum(TradeStatus)
  status: TradeStatus;
}
