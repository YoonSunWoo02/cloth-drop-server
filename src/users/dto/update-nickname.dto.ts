import { IsString, MaxLength } from 'class-validator';

export class UpdateNicknameDto {
  @IsString()
  @MaxLength(20)
  nickname: string;
}
