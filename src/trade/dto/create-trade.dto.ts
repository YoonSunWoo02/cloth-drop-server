import {
  IsString,
  IsNumber,
  IsEnum,
  IsInt,
  Min,
  IsArray,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { TradeCategory } from '../trade-post.entity';

class CreateTradeImageDto {
  @IsString()
  imageUrl: string;

  @IsInt()
  @Min(0)
  order: number;
}

export class CreateTradeDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsInt()
  @Min(0)
  price: number;

  @IsEnum(TradeCategory)
  category: TradeCategory;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateTradeImageDto)
  images?: CreateTradeImageDto[];
}
