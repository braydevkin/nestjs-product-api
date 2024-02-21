import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

import {
  IDatabaseRepository,
  IProduct,
  ReadAllResponse,
} from 'src/domain/interfaces';
import { ProductCreateManyUseCase } from './createMany';
import { ProductTranslateUseCase } from './translate';
import { contentfulProductMock } from '../../../mocks/contentful-product.mock';
import { ProductGetFromContentfulApiUseCase } from './getFromContentfulApi';
import { ProductReadAllUseCase } from './getProducts';
import { ProductSoftDeleteUseCase } from './softDelete';
import { ProductSummaryUseCase } from './summary';
import { ISummaryFilterProps } from 'src/domain/interfaces/summary-interface';

describe('==> Product use case', () => {
  let productCreateManyUseCase: ProductCreateManyUseCase;
  let productTranslateUseCase: ProductTranslateUseCase;
  let productGetFromContentfulApiUseCase: ProductGetFromContentfulApiUseCase;
  let productReadAllUseCase: ProductReadAllUseCase;
  let productSoftDeleteUseCase: ProductSoftDeleteUseCase;
  let productSummaryUseCase: ProductSummaryUseCase;
  let httpService: HttpService;
  let repository: IDatabaseRepository<IProduct>;
  let product: IProduct;

  beforeAll(() => {
    repository = {
      findOneAndUpdate: jest.fn(),
      readAll: jest.fn(),
      count: jest.fn(),
    } as unknown as IDatabaseRepository<IProduct>;
    productCreateManyUseCase = new ProductCreateManyUseCase(repository);
    productTranslateUseCase = new ProductTranslateUseCase();
    productReadAllUseCase = new ProductReadAllUseCase(repository);
    productSoftDeleteUseCase = new ProductSoftDeleteUseCase(repository);
    productSummaryUseCase = new ProductSummaryUseCase(repository);
    httpService = {
      axiosRef: {
        get: jest.fn(),
      },
    } as unknown as HttpService;
    productGetFromContentfulApiUseCase = new ProductGetFromContentfulApiUseCase(
      httpService,
    );
    product = {
      productId: '1',
      name: 'Product 1',
      sku: '',
      brand: '',
      model: '',
      category: '',
      color: '',
      price: 0,
      currency: '',
      stock: 0,
      createdAt: '',
      updatedAt: '',
    };
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('#CREATE_MANY', () => {
    describe('When createMany is called with array of translated products', () => {
      it('Should call repository findOneAndUpdate and save this value', async () => {
        const products: IProduct[] = [product];

        await productCreateManyUseCase.execute(products);

        expect(repository.findOneAndUpdate).toHaveBeenCalled();
        expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
          { productId: product.productId },
          products[0],
        );
      });
    });
  });

  describe('GET_FROM_CONTENTFUL_API', () => {
    describe('When received an array of untranslated products', () => {
      it('Should translate and return an array of products', async () => {
        const contentfulApiProductUri = 'https://example.com/products';
        const responseData = { data: [{ id: '1', name: 'Product 1' }] };
        const expectedResponse: AxiosResponse<any> = {
          data: responseData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config: {
            headers: undefined,
          },
        };

        jest
          .spyOn(httpService.axiosRef, 'get')
          .mockImplementation(() => Promise.resolve(expectedResponse));

        const result = await productGetFromContentfulApiUseCase.execute(
          contentfulApiProductUri,
        );

        expect(httpService.axiosRef.get).toHaveBeenCalledWith(
          contentfulApiProductUri,
        );
        expect(result).toEqual(expectedResponse);
      });
    });
  });

  describe('#TRANSLATE', () => {
    describe('When received an valid contentful product api URL', () => {
      it('Should call GET from Axios returning a product data', () => {
        const products = productTranslateUseCase.execute({
          items: [contentfulProductMock],
        });

        expect(products.length).toBeGreaterThan(0);
        expect(products[0].productId).not.toBeUndefined();
      });
    });
  });

  describe('#GET_PRODUCTS', () => {
    describe('When queries are used to find products', () => {
      it('Should return an array of products', async () => {
        const query: Partial<IProduct> = { category: 'smartphone' };
        const expectedResponse: ReadAllResponse<IProduct> = {
          skip: 0,
          limit: 10,
          total: 20,
          data: [product],
        };

        jest
          .spyOn(repository, 'readAll')
          .mockImplementation(() => Promise.resolve(expectedResponse));

        const result = await productReadAllUseCase.execute(query);

        expect(repository.readAll).toHaveBeenCalledWith(query);
        expect(result).toEqual(expectedResponse);
      });
    });
  });

  describe('SOFT_DELETE', () => {
    describe('When product is soft deleted', () => {
      it('should execute findOneAndUpdate method of the repository to soft delete the product', async () => {
        const productId = 'product_id';
        await productSoftDeleteUseCase.execute(productId);

        expect(repository.findOneAndUpdate).toHaveBeenCalledWith(
          { _id: productId },
          { deletedAt: expect.any(String) },
        );
      });

      it('should return { deleted: true } after successful soft deletion', async () => {
        const productId = 'product_id';

        const result = await productSoftDeleteUseCase.execute(productId);

        expect(result).toEqual({ deleted: true });
      });
    });
  });

  describe('#SUMMARY', () => {
    describe('When start_date and end_date are valid queries', () => {
      it('Should return a number of deleted products is this time range', async () => {
        const query: ISummaryFilterProps = {
          query: {
            start_date: '2022-01-01T00:00:00.000Z',
            end_date: '2022-12-31T23:59:59.999Z',
          },
        };
        const expectedDeletedCount = 5;
        jest
          .spyOn(repository, 'count')
          .mockImplementation(() => Promise.resolve(expectedDeletedCount));

        const result = await productSummaryUseCase.execute(query);

        expect(repository.count).toHaveBeenCalledWith({
          deletedAt: { $exists: true },
          createdAt: {
            $gte: query.query.start_date,
            $lte: query.query.end_date || expect.any(String),
          },
        });
        expect(result).toEqual({
          deleted: expectedDeletedCount,
          message:
            expectedDeletedCount > 1
              ? ` ${expectedDeletedCount} Products has been deleted`
              : ` ${expectedDeletedCount} Product has been deleted`,
        });
      });

      it('should return summary information with zero deleted products if no query provided', async () => {
        const query: ISummaryFilterProps = { query: {} };
        const expectedDeletedCount = 0;
        jest
          .spyOn(repository, 'count')
          .mockImplementation(() => Promise.resolve(expectedDeletedCount));

        const result = await productSummaryUseCase.execute(query);

        expect(repository.count).toHaveBeenCalledWith({});
        expect(result).toEqual({
          deleted: expectedDeletedCount,
          message: ` ${expectedDeletedCount} Product has been deleted`,
        });
      });
    });
  });
});
