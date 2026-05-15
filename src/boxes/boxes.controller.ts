import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import { BoxesService } from './boxes.service';
import { CreateBoxDto } from './dto/create-box.dto';
import { NearbyBoxesQueryDto } from './dto/nearby-boxes-query.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('boxes')
export class BoxesController {
  constructor(private readonly boxesService: BoxesService) {}

  @Get()
  findNearby(@Query() query: NearbyBoxesQueryDto) {
    return this.boxesService.findNearby(query.lat, query.lng, query.radius);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boxesService.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: CreateBoxDto) {
    return this.boxesService.create(dto);
  }
}
