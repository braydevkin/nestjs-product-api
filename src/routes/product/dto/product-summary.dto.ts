import { ApiProperty } from '@nestjs/swagger';

import { IsOptional, IsDateString } from 'class-validator';

export class ProductSummaryDTO {
  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  start_date: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  end_date: string;
}
