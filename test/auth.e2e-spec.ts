import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { faker } from '@faker-js/faker';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('==> Auth Controller (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /signup', () => {
    it('Should register a new user and return success object', async () => {
      const httpServer = app.getHttpServer();

      const signUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      const registered = await request(httpServer)
        .post('/signup')
        .send(signUpDto);

      expect(registered.body).toHaveProperty('message');
      expect(registered.body).toHaveProperty('email');
      expect(registered.body).toHaveProperty('status');
    });
  });

  describe('POST /signin', () => {
    it('Should sign in user and return access_token', async () => {
      const httpServer = app.getHttpServer();

      const signUpDto = {
        email: faker.internet.email(),
        password: faker.internet.password(),
      };

      await request(httpServer).post('/signup').send(signUpDto);

      const user = await request(httpServer).post('/signin').send(signUpDto);

      expect(user.body).toHaveProperty('access_token');
    });
  });
});
