import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { ProductSummaryDTO } from './dto/product-summary.dto';
import { ProductGetDTO } from './dto/product-get.dto';
import { JwtService } from '@nestjs/jwt';

describe('ProductController', () => {
  let controller: ProductController;
  let productService: ProductService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        JwtService,
        {
          provide: ProductService,
          useValue: {
            summary: jest.fn(),
            getProducts: jest.fn(),
            softDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    productService = module.get<ProductService>(ProductService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('#SUMMARY', () => {
    describe('When summary route is called', () => {
      it('should call productService.summary with correct query', async () => {
        const query: ProductSummaryDTO = {
          start_date: '2022-01-01',
          end_date: '2022-12-31',
        };

        await controller.summary(query);

        expect(productService.summary).toHaveBeenCalledWith({ query });
      });
    });
  });

  describe('GET_PRODUCTS', () => {
    describe('When GET products route is called', () => {
      it('should call productService.getProducts with correct query', async () => {
        const query: ProductGetDTO = {
          category: 'electronics',
          limit: 0,
          skip: 0,
          productId: '',
          name: '',
          sku: '',
          brand: '',
          model: '',
          color: '',
          price: 0,
          currency: '',
          stock: 0,
          createdAt: '',
          updatedAt: '',
          deletedAt: '',
        };

        await controller.getProducts(query);

        expect(productService.getProducts).toHaveBeenCalledWith(query);
      });
    });
  });

  describe('#SOFT_DELETE', () => {
    describe('When soft delete route is called', () => {
      it('should call productService.softDelete with correct _id', async () => {
        const _id = '123';

        await controller.softDelete(_id);

        expect(productService.softDelete).toHaveBeenCalledWith(_id);
      });
    });
  });
});
