import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateNicknameDto } from './dto/update-nickname.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from './user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  getProfile(@Request() req: { user: User }) {
    return this.usersService.getProfile(req.user);
  }

  @Patch('me/nickname')
  updateNickname(
    @Request() req: { user: User },
    @Body() dto: UpdateNicknameDto,
  ) {
    return this.usersService.updateNickname(req.user.id, dto.nickname);
  }
}
