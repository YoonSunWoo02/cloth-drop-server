import {
  IsString,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  IsOptional,
} from 'class-validator';
import { TradeCategory } from '../trade-post.entity';

export class UpdateTradeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsEnum(TradeCategory)
  category?: TradeCategory;
}
