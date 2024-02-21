import { IDatabaseRepository, IProduct } from 'src/domain/interfaces';

export class ProductCreateManyUseCase {
  constructor(private repository: IDatabaseRepository<IProduct>) {}

  async execute(products: IProduct[]): Promise<void> {
    for (const product of products) {
      const { productId } = product;
      await this.repository.findOneAndUpdate({ productId }, product);
    }
  }
}
