import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Box } from './box.entity';
import { CreateBoxDto } from './dto/create-box.dto';

@Injectable()
export class BoxesService {
  private readonly earthRadiusKm = 6371;

  constructor(
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) {}

  async findNearby(lat: number, lng: number, radiusKm: number) {
    const distanceFormula = `${this.earthRadiusKm} * acos(
      LEAST(1.0, GREATEST(-1.0,
        cos(radians(:lat)) * cos(radians(CAST(box.latitude AS float8))) *
        cos(radians(CAST(box.longitude AS float8)) - radians(:lng)) +
        sin(radians(:lat)) * sin(radians(CAST(box.latitude AS float8)))
      ))
    )`;

    const { entities, raw } = await this.boxRepository
      .createQueryBuilder('box')
      .addSelect(distanceFormula, 'distance')
      .where(`${distanceFormula} <= :radius`)
      .setParameters({ lat, lng, radius: radiusKm })
      .orderBy('distance', 'ASC')
      .getRawAndEntities();

    return entities.map((box, index) => {
      const row = raw[index] as { distance: string | number };
      return {
        ...box,
        distance: Number(row.distance),
      };
    });
  }

  async findOne(id: string) {
    const box = await this.boxRepository.findOne({ where: { id } });
    if (!box) {
      throw new NotFoundException('수거함을 찾을 수 없습니다.');
    }
    return box;
  }

  async create(dto: CreateBoxDto) {
    const box = this.boxRepository.create(dto);
    return this.boxRepository.save(box);
  }
}
