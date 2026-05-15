import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  ParseUUIDPipe,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ReportsService } from './reports.service';
import { CreateReportDto } from './dto/create-report.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User } from '../users/user.entity';

@Controller('boxes/:boxId/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('latest')
  findLatest(@Param('boxId', ParseUUIDPipe) boxId: string) {
    return this.reportsService.findLatest(boxId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Param('boxId', ParseUUIDPipe) boxId: string,
    @Body() dto: CreateReportDto,
    @Req() req: Request & { user: User },
  ) {
    return this.reportsService.create(boxId, req.user.id, dto);
  }
}
