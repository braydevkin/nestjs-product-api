import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { IProduct } from 'src/domain/interfaces';

export class ProductGetDTO implements IProduct {
  @ApiProperty({ required: false, default: 10 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  limit: number;

  @ApiProperty({ required: false, default: 1 })
  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  skip: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  productId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  brand: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  model: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  category: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  color: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  price: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  currency: string;

  @ApiProperty({ required: false })
  @IsNumber()
  @IsOptional()
  stock: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  createdAt: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  updatedAt: string;

  @ApiProperty({ required: false })
  @IsDateString()
  @IsOptional()
  deletedAt: string;
}
