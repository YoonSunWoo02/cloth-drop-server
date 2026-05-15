import {
  Controller,
  Get,
  Post,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { FavoritesService } from './favorites.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('boxes/:id/favorite')
@UseGuards(JwtAuthGuard)
export class BoxFavoriteController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Post()
  toggle(
    @Param('id', ParseUUIDPipe) boxId: string,
    @Req() req: Request & { user: User },
  ) {
    return this.favoritesService.toggle(boxId, req.user.id);
  }
}

@Controller('users/me/favorites')
@UseGuards(JwtAuthGuard)
export class UserFavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  findAll(@Req() req: Request & { user: User }) {
    return this.favoritesService.findAllByUser(req.user.id);
  }
}
