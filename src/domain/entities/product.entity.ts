import {
  IProduct,
  IUntranslatedProduct,
  IUntranslatedProductItems,
} from '../interfaces';

export class ProductEntity {
  public product: IProduct;
  public untranslatedProduct: IUntranslatedProduct;

  private constructor(
    product: IProduct,
    untranslatedProduct?: IUntranslatedProduct,
  ) {
    this.product = product;
    this.untranslatedProduct = untranslatedProduct;
    if (!product) {
      //@ts-expect-error used for ORM
      this.product = {};
      return;
    }

    if (!untranslatedProduct) {
      //@ts-expect-error used for ORM
      this.untranslatedProduct = {};
      return;
    }
  }

  static create(product: IProduct) {
    return new ProductEntity(product);
  }

  static translate(untranslatedProduct: IUntranslatedProduct): IProduct {
    const { sys, fields } = untranslatedProduct;
    return {
      productId: sys.id,
      ...fields,
      createdAt: sys.createdAt,
      updatedAt: sys.updatedAt,
    };
  }

  static translateProducts({ items }: IUntranslatedProductItems) {
    const response: IProduct[] = [];

    for (const item of items) {
      response.push(ProductEntity.translate(item));
    }

    return response;
  }

  toJSON() {
    return this.product;
  }
}
