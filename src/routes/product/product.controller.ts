import {
  Controller,
  UseGuards,
  Param,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { ProductService } from './product.service';
import { ProductSummaryDTO } from './dto/product-summary.dto';
import { ProductGetDTO } from './dto/product-get.dto';

@ApiBearerAuth()
@ApiTags('Product')
@Controller('')
export class ProductController {
  constructor(private productService: ProductService) {}

  @UseGuards(AuthGuard)
  @Get('/summary')
  summary(@Query() query: ProductSummaryDTO) {
    return this.productService.summary({ query });
  }

  @Get('/products')
  getProducts(@Query() query: ProductGetDTO) {
    return this.productService.getProducts(query);
  }

  @UseGuards(AuthGuard)
  @Delete('/products/:_id')
  softDelete(@Param('_id') _id: string) {
    return this.productService.softDelete(_id);
  }
}
