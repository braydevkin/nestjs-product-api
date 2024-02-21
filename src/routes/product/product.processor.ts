import { Processor, WorkerHost } from '@nestjs/bullmq';
import { ProductService } from './product.service';

@Processor('save-products')
export class ProductProcessor extends WorkerHost {
  constructor(private productService: ProductService) {
    super();
  }

  async process(): Promise<any> {
    return this.productService.createMany();
  }
}
