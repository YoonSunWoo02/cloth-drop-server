import { IsEnum } from 'class-validator';
import { ReportStatus } from '../report.entity';

export class CreateReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;
}
