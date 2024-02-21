import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';
import { IProduct } from 'src/domain/interfaces';

export class ProductCreateDTO implements IProduct {
  @IsString()
  limit: number;

  @ApiProperty({ required: false, default: 1 })
  @IsString()
  skip: number;

  @ApiProperty({ required: false })
  @IsString()
  productId: string;

  @ApiProperty({ required: false })
  @IsString()
  name: string;

  @ApiProperty({ required: false })
  @IsString()
  sku: string;

  @ApiProperty({ required: false })
  @IsString()
  brand: string;

  @ApiProperty({ required: false })
  @IsString()
  model: string;

  @ApiProperty({ required: false })
  @IsString()
  category: string;

  @ApiProperty({ required: false })
  @IsString()
  color: string;

  @ApiProperty({ required: false })
  @IsNumber()
  price: number;

  @ApiProperty({ required: false })
  @IsString()
  currency: string;

  @ApiProperty({ required: false })
  @IsNumber()
  stock: number;

  @ApiProperty({ required: false })
  @IsString()
  createdAt: string;

  @ApiProperty({ required: false })
  @IsString()
  updatedAt: string;
}
