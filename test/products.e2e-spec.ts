import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { IProduct } from 'src/domain/interfaces';
import { Model } from 'mongoose';
import { generateProductSeed } from './seed/generateProductSeed';
import { getModelToken } from '@nestjs/mongoose';
import {
  Product,
  ProductDocument,
} from '../src/infra/db/schemas/product.schema';

describe('==> Product Controller (e2e)', () => {
  let app: INestApplication;
  let mockProductModel: Model<ProductDocument>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getModelToken(Product.name),
          useValue: Model,
        },
      ],
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    mockProductModel = app.get<Model<ProductDocument>>(
      getModelToken(Product.name),
    );
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /products', () => {
    it('Should return product list paginated', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .then((response) => {
          expect(response.body).toHaveProperty('data');
          expect(response.body.data).toBeInstanceOf(Array);
          expect(response.body).toHaveProperty('total');
        });
    });

    it('Should return a product list even when query is empty', () => {
      return request(app.getHttpServer())
        .get('/products')
        .expect(200)
        .then((response) => {
          expect(response.body).not.toBeUndefined();
          expect(response.body).toHaveProperty('total');
        });
    });

    it('Should return a product list when has limit and skip', () => {
      const limit = faker.number.int({ min: 0, max: 5 });
      const skip = faker.number.int({ min: 0 });

      return request(app.getHttpServer())
        .get(`/products?limit=${limit}&skip=${skip}`)
        .expect(200)
        .then((response) => {
          expect(response.body).toMatchObject({
            limit,
            skip,
          });
        });
    });
  });

  describe('DELETE /products:id', () => {
    it('Should delete an product and return status code OK', async () => {
      const httpServer = app.getHttpServer();

      const signUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(httpServer).post('/signup').send(signUpDto);

      const signInResponse = await request(httpServer)
        .post('/signin')
        .send(signUpDto);

      const { access_token } = signInResponse.body;

      await generateProductSeed(mockProductModel as any);
      const products = await request(httpServer).get('/products');
      expect(products.status).toBe(HttpStatus.OK);

      const [deleteProduct] = products.body.data as IProduct[];

      const deleteResponse = await request(httpServer)
        .delete(`/products/${deleteProduct._id}`)
        .set('Authorization', `Bearer ${access_token}`);
      expect(deleteResponse.status).toBe(HttpStatus.OK);
      expect(deleteResponse.body.deleted).toBe(true);
    });
  });

  describe('GET /summary', () => {
    it('Should return total products deleted when start_date and end_date are empty', async () => {
      const httpServer = app.getHttpServer();

      const signUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(httpServer).post('/signup').send(signUpDto);
      const signInResponse = await request(httpServer)
        .post('/signin')
        .send(signUpDto);

      const { access_token } = signInResponse.body;

      const summaryResponse = await request(httpServer)
        .get('/summary')
        .query({})
        .set('Authorization', `Bearer ${access_token}`);
      expect(summaryResponse.body).toHaveProperty('message');
      expect(summaryResponse.body).toHaveProperty('deleted');
    });

    it('Should return total products deleted when some filter is not empty', async () => {
      const httpServer = app.getHttpServer();

      const signUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(httpServer).post('/signup').send(signUpDto);
      const signInResponse = await request(httpServer)
        .post('/signin')
        .send(signUpDto);

      const { access_token } = signInResponse.body;

      const summaryResponse = await request(httpServer)
        .get('/summary')
        .query({ start_date: new Date().toISOString() })
        .set('Authorization', `Bearer ${access_token}`);
      expect(summaryResponse.body).toHaveProperty('message');
      expect(summaryResponse.body).toHaveProperty('deleted');
    });
  });
});
