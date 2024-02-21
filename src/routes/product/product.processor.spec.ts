import { Test, TestingModule } from '@nestjs/testing';
import { ProductProcessor } from './product.processor';
import { ProductService } from './product.service';

describe('==> ProductProcessor', () => {
  let processor: ProductProcessor;
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductProcessor,
        {
          provide: ProductService,
          useValue: {
            createMany: jest.fn(),
          },
        },
      ],
    }).compile();

    processor = module.get<ProductProcessor>(ProductProcessor);
    productService = module.get<ProductService>(ProductService);
  });

  describe('When job is starts processor', () => {
    it('Should call createMany from use case at least once', async () => {
      jest
        .spyOn(productService, 'createMany')
        .mockImplementation(() => Promise.resolve());

      await processor.process();

      expect(productService.createMany).toHaveBeenCalled();
    });
  });
});
