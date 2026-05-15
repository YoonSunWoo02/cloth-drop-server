import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateBoxDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsNumber()
  latitude: number;

  @IsNumber()
  longitude: number;

  @IsOptional()
  @IsString()
  operatingHours?: string;
}
