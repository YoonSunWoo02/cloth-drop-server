import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { Box } from '../boxes/box.entity';
import { CreateReportDto } from './dto/create-report.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportRepository: Repository<Report>,
    @InjectRepository(Box)
    private readonly boxRepository: Repository<Box>,
  ) {}

  async findLatest(boxId: string) {
    await this.ensureBoxExists(boxId);

    const report = await this.reportRepository.findOne({
      where: { boxId },
      order: { createdAt: 'DESC' },
    });
    if (!report) {
      throw new NotFoundException('제보를 찾을 수 없습니다.');
    }
    return report;
  }

  async create(boxId: string, userId: string, dto: CreateReportDto) {
    await this.ensureBoxExists(boxId);

    const report = this.reportRepository.create({
      boxId,
      userId,
      status: dto.status,
    });
    return this.reportRepository.save(report);
  }

  private async ensureBoxExists(boxId: string) {
    const box = await this.boxRepository.findOne({ where: { id: boxId } });
    if (!box) {
      throw new NotFoundException('수거함을 찾을 수 없습니다.');
    }
  }
}
