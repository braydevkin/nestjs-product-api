import { Injectable } from '@nestjs/common';

import { ProductGetFromContentfulApiUseCase } from '../../application/useCases/product/getFromContentfulApi';
import { ProductTranslateUseCase } from '../../application/useCases/product/translate';
import { ProductCreateManyUseCase } from '../../application/useCases/product/createMany';
import { ProductSoftDeleteUseCase } from '../../application/useCases/product/softDelete';
import { ProductReadAllUseCase } from '../../application/useCases/product/getProducts';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { IProduct } from '../../domain/interfaces';
import { ProductSummaryUseCase } from '../../application/useCases/product/summary';
import { ISummaryFilterProps } from '../../domain/interfaces/summary-interface';

@Injectable()
export class ProductService {
  constructor(
    private productGetFromContentfulApiUseCase: ProductGetFromContentfulApiUseCase,
    private productTranslateUseCase: ProductTranslateUseCase,
    private productCreateManyUseCase: ProductCreateManyUseCase,
    private productSoftDeleteUseCase: ProductSoftDeleteUseCase,
    private productReadAllUseCase: ProductReadAllUseCase,
    private productSummaryUseCase: ProductSummaryUseCase,
    @InjectQueue('save-products') private saveProductsQueue: Queue,
  ) {}

  async onModuleInit() {
    await this.saveProductsQueue.add('save-products', null, {
      jobId: 'save-products-hourly',
      repeat: {
        every: 3600000,
      },
    });
  }

  async createMany() {
    const {
      data: { items },
    } = await this.productGetFromContentfulApiUseCase.execute(
      process.env.CONTENTFUL_API_PRODUCT,
    );

    const transtedProducts = this.productTranslateUseCase.execute({
      items,
    });

    return await this.productCreateManyUseCase.execute(transtedProducts);
  }

  async summary({ query }: ISummaryFilterProps) {
    return await this.productSummaryUseCase.execute({ query });
  }

  async getProducts(query: Partial<IProduct>) {
    return await this.productReadAllUseCase.execute(query);
  }

  async softDelete(_id: string) {
    return await this.productSoftDeleteUseCase.execute(_id);
  }
}
