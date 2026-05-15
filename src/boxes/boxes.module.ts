import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Box } from './box.entity';
import { BoxesService } from './boxes.service';
import { BoxesController } from './boxes.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Box]), AuthModule],
  controllers: [BoxesController],
  providers: [BoxesService],
})
export class BoxesModule {}
