import { ProductEntity } from '../../../domain/entities/product.entity';
import {
  IProduct,
  IUntranslatedProductItems,
} from '../../../domain/interfaces';

export class ProductTranslateUseCase {
  constructor() {}

  execute({ items }: IUntranslatedProductItems): IProduct[] {
    const products: IProduct[] = ProductEntity.translateProducts({ items });
    return products;
  }
}
