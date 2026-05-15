import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './favorite.entity';
import { Box } from '../boxes/box.entity';
import { FavoritesService } from './favorites.service';
import {
  BoxFavoriteController,
  UserFavoritesController,
} from './favorites.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite, Box]), AuthModule],
  controllers: [BoxFavoriteController, UserFavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
