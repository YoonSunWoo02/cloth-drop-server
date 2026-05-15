import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './favorite.entity';
import { Box } from '../boxes/box.entity';

@Injectable()
export class FavoritesService {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) {}

  async toggle(boxId: string, userId: string) {
    await this.ensureBoxExists(boxId);

    const existing = await this.favoriteRepository.findOne({
      where: { userId, boxId },
    });

    if (existing) {
      await this.favoriteRepository.remove(existing);
      return { favorited: false };
    }

    const favorite = this.favoriteRepository.create({ userId, boxId });
    await this.favoriteRepository.save(favorite);
    return { favorited: true };
  }

  async findAllByUser(userId: string) {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['box'],
      order: { createdAt: 'DESC' },
    });
  }

  private async ensureBoxExists(boxId: string) {
    const box = await this.boxRepository.findOne({ where: { id: boxId } });
    if (!box) {
      throw new NotFoundException('수거함을 찾을 수 없습니다.');
    }
  }
}
