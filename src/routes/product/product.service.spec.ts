import { Test, TestingModule } from '@nestjs/testing';
import { AxiosResponse } from 'axios';

import { ProductService } from './product.service';
import { ProductGetFromContentfulApiUseCase } from '../../application/useCases/product/getFromContentfulApi';
import { ProductTranslateUseCase } from '../../application/useCases/product/translate';
import { ProductCreateManyUseCase } from '../../application/useCases/product/createMany';
import { ProductSoftDeleteUseCase } from '../../application/useCases/product/softDelete';
import { ProductReadAllUseCase } from '../../application/useCases/product/getProducts';
import { ProductSummaryUseCase } from '../../application/useCases/product/summary';
import { IProduct } from 'src/domain/interfaces';
import { getQueueToken } from '@nestjs/bullmq';

describe('ProductService', () => {
  let service: ProductService;
  let productGetFromContentfulApiUseCase: ProductGetFromContentfulApiUseCase;
  let productTranslateUseCase: ProductTranslateUseCase;
  let productCreateManyUseCase: ProductCreateManyUseCase;
  let productSoftDeleteUseCase: ProductSoftDeleteUseCase;
  let productReadAllUseCase: ProductReadAllUseCase;
  let productSummaryUseCase: ProductSummaryUseCase;
  let product: IProduct;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductGetFromContentfulApiUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductTranslateUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductCreateManyUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductSoftDeleteUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductReadAllUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },
        {
          provide: ProductSummaryUseCase,
          useValue: {
            execute: jest.fn(),
          },
        },

        {
          provide: getQueueToken('save-products'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    productGetFromContentfulApiUseCase =
      module.get<ProductGetFromContentfulApiUseCase>(
        ProductGetFromContentfulApiUseCase,
      );
    productTranslateUseCase = module.get<ProductTranslateUseCase>(
      ProductTranslateUseCase,
    );
    productCreateManyUseCase = module.get<ProductCreateManyUseCase>(
      ProductCreateManyUseCase,
    );
    productSoftDeleteUseCase = module.get<ProductSoftDeleteUseCase>(
      ProductSoftDeleteUseCase,
    );
    productReadAllUseCase = module.get<ProductReadAllUseCase>(
      ProductReadAllUseCase,
    );
    productSummaryUseCase = module.get<ProductSummaryUseCase>(
      ProductSummaryUseCase,
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

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('#CREATE_MANY', () => {
    it('should call all required use cases with correct data', async () => {
      const translatedProducts = [product];

      const expectedResponse: AxiosResponse<any> = {
        data: { items: [product] },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {
          headers: undefined,
        },
      };

      jest
        .spyOn(productGetFromContentfulApiUseCase, 'execute')
        .mockImplementation(() => Promise.resolve(expectedResponse));

      jest
        .spyOn(productTranslateUseCase, 'execute')
        .mockImplementation(() => translatedProducts);

      jest
        .spyOn(productTranslateUseCase, 'execute')
        .mockImplementation(() => translatedProducts);

      jest.spyOn(productCreateManyUseCase, 'execute');

      await service.createMany();

      expect(productGetFromContentfulApiUseCase.execute).toHaveBeenCalledWith(
        process.env.CONTENTFUL_API_PRODUCT,
      );
      expect(productTranslateUseCase.execute).toHaveBeenCalled();
      expect(productCreateManyUseCase.execute).toHaveBeenCalledWith(
        translatedProducts,
      );
    });
  });

  describe('#SUMMARY', () => {
    describe('When summary is called ', () => {
      it('should return result from use case', async () => {
        jest
          .spyOn(productSummaryUseCase, 'execute')
          .mockImplementation(() =>
            Promise.resolve({ message: 'any_message', deleted: 10 }),
          );

        const summary = await service.summary({ query: {} });
        expect(summary.message).toBe('any_message');
        expect(summary.deleted).toBe(10);
        expect(productSummaryUseCase.execute).toHaveBeenCalled();
      });
    });
  });

  describe('#GET_PRODUCTS', () => {
    describe('When get products is called ', () => {
      it('should return result an array of products', async () => {
        jest
          .spyOn(productReadAllUseCase, 'execute')
          .mockImplementation(() => Promise.resolve([product]));

        const products = await service.getProducts({});
        expect(products.length).toBeGreaterThan(0);
        expect(products[0].productId).not.toBeUndefined();
        expect(productReadAllUseCase.execute).toHaveBeenCalled();
      });
    });
  });

  describe('#SOFT_DELETE', () => {
    describe('When soft delete is called ', () => {
      it('should return result an object with deleted true', async () => {
        jest
          .spyOn(productSoftDeleteUseCase, 'execute')
          .mockImplementation(() => Promise.resolve({ deleted: true }));

        const { deleted } = await service.softDelete('any_id');
        expect(deleted).not.toBeUndefined();
        expect(deleted).toBe(true);
        expect(productSoftDeleteUseCase.execute).toHaveBeenCalled();
      });
    });
  });
});
