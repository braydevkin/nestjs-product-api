import { Module } from '@nestjs/common';
import { HttpModule, HttpService } from '@nestjs/axios';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductTranslateUseCase } from '../../application/useCases/product/translate';
import { ProductGetFromContentfulApiUseCase } from '../../application/useCases/product/getFromContentfulApi';
import { ProductSoftDeleteUseCase } from '../../application/useCases/product/softDelete';
import { ProductCreateManyUseCase } from '../../application/useCases/product/createMany';
import { MongoDbRepository } from '../../infra/db/mongodb.repository';
import { IDatabaseRepository, IProduct } from '../../domain/interfaces';
import { Model } from 'mongoose';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { ProductSchema } from '../../infra/db/schemas/product.schema';
import { BullModule } from '@nestjs/bullmq';
import { ProductProcessor } from './product.processor';
import { ProductReadAllUseCase } from '../../application/useCases/product/getProducts';
import { ProductSummaryUseCase } from '../../application/useCases/product/summary';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
    BullModule.registerQueue({
      name: 'save-products',
    }),
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductTranslateUseCase,
    ProductGetFromContentfulApiUseCase,
    MongoDbRepository,
    ProductProcessor,
    {
      provide: ProductProcessor,
      useFactory: (productService: ProductService) => {
        return new ProductProcessor(productService);
      },
      inject: [ProductService],
    },
    {
      provide: MongoDbRepository,
      useFactory: (model: Model<IProduct>) => {
        return new MongoDbRepository(model);
      },
      inject: [getModelToken('Product')],
    },
    {
      provide: ProductCreateManyUseCase,
      useFactory: (repository: IDatabaseRepository<IProduct>) => {
        return new ProductCreateManyUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
    {
      provide: ProductSummaryUseCase,
      useFactory: (repository: IDatabaseRepository<IProduct>) => {
        return new ProductSummaryUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
    {
      provide: ProductGetFromContentfulApiUseCase,
      useFactory: (httpService: HttpService) => {
        return new ProductGetFromContentfulApiUseCase(httpService);
      },
      inject: [HttpService],
    },
    {
      provide: ProductSoftDeleteUseCase,
      useFactory: (repository: IDatabaseRepository<IProduct>) => {
        return new ProductSoftDeleteUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
    {
      provide: ProductReadAllUseCase,
      useFactory: (repository: IDatabaseRepository<IProduct>) => {
        return new ProductReadAllUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
  ],
})
export class ProductModule {}
