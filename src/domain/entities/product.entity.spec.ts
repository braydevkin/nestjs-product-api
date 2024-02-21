import { ProductEntity } from './product.entity';
import { IProduct } from '../interfaces';
import { contentfulProductMock } from '../../mocks/contentful-product.mock';

describe('==> Product entity', () => {
  let product: IProduct;
  beforeAll(() => {
    product = {
      productId: 'any_product_id',
      sku: 'any_stuck',
      name: 'any_name',
      brand: 'any_brand',
      model: 'any_model',
      category: 'any_category',
      color: 'any_color',
      price: 0,
      currency: 'any_currency',
      stock: 0,
      createdAt: 'any_created_at',
      updatedAt: 'any_updated_at',
    };
  });

  describe('#CREATE', () => {
    describe('When ProductEntity create is called with product data', () => {
      it('Should return a product data object', () => {
        const productEntity = ProductEntity.create(product);
        expect(productEntity.product).toEqual(product);
      });
    });

    describe('When ProductEntity create is called with any information', () => {
      it('Should return a product data object', () => {
        const productEntity = ProductEntity.create(null);
        expect(productEntity.product).toEqual({});
      });
    });
  });

  describe('#TRANSLATE', () => {
    const productEntityTranslated = ProductEntity.translate(
      contentfulProductMock,
    );
    expect(productEntityTranslated.productId).not.toBeUndefined();
    expect(productEntityTranslated.createdAt).not.toBeUndefined();
    expect(productEntityTranslated.updatedAt).not.toBeUndefined();
  });

  describe('#TRANSLATE_PRODUCTS', () => {
    const productEntityTranslated = ProductEntity.translateProducts({
      items: [contentfulProductMock],
    });
    expect(productEntityTranslated[0].productId).not.toBeUndefined();
    expect(productEntityTranslated[0].createdAt).not.toBeUndefined();
    expect(productEntityTranslated[0].updatedAt).not.toBeUndefined();
  });

  describe('#TOJSON', () => {
    describe('When create is call with product data', () => {
      it('ToJson should return this product data', () => {
        const productEntity = ProductEntity.create(product);
        const json = productEntity.toJSON();
        expect(json).toEqual(product);
      });
    });
  });
});
