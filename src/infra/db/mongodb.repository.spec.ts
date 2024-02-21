import { Model } from 'mongoose';
import { faker } from '@faker-js/faker';

import { MongoDbRepository } from './mongodb.repository';

describe('==> MongoDbRepository', () => {
  let model, mongoDbRepository, data;
  beforeAll(() => {
    model = {
      create: jest.fn().mockImplementation(() => ({ save: jest.fn() })),
      findOne: jest.fn().mockImplementation(() => ({ exec: jest.fn() })),
      findOneAndUpdate: jest.fn().mockImplementation(() => ({
        exec: jest.fn(),
      })),
      find: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation(() => ({
          skip: jest.fn().mockImplementation(() => ({
            exec: jest.fn(),
          })),
        })),
      })),
      countDocuments: jest.fn().mockImplementation(() => ({
        exec: jest.fn(),
      })),
    } as unknown as Model<any>;
    mongoDbRepository = new MongoDbRepository(model as Model<any>);
    data = {
      email: faker.internet.email(),
    };
  });

  describe('#CREATE', () => {
    describe('When model create function is called successfully', () => {
      it('Should create a new document', async () => {
        await mongoDbRepository.create(data);
        expect(model.create).toHaveBeenCalledWith(data);
      });
    });

    describe('When some error ocours', () => {
      it('should throw HttpException on create error', async () => {
        model.create.mockRejectedValueOnce(new Error('Error'));

        await expect(mongoDbRepository.create(data)).rejects.toThrow('Error');
      });
    });
  });

  describe('#READ', () => {
    describe('When is read function is called with a query', () => {
      it('Should call read at least once', async () => {
        const query = data;
        await mongoDbRepository.read(query);

        expect(model.findOne).toHaveBeenCalledWith(query);
      });
    });

    describe('When some error ocours', () => {
      it('should throw HttpException on create error', async () => {
        const query = data;
        model.findOne.mockImplementation(() => {
          throw new Error('Error');
        });

        await expect(() => mongoDbRepository.read(query)).rejects.toThrow(
          'Error',
        );
      });
    });
  });

  describe('#FIND_ONE_AND_UPDATE', () => {
    describe('When  findOneAndUpdate function is called with a query and data', () => {
      it('Should call findOneAndUpdate at least once', async () => {
        const query = { value: 'any_value' };
        const data = query;

        await mongoDbRepository.findOneAndUpdate(query, data);

        expect(model.findOneAndUpdate).toHaveBeenCalled();
      });
    });

    describe('When some error ocours', () => {
      it('should throw HttpException on create error', async () => {
        model.findOneAndUpdate.mockImplementation(() => {
          throw new Error('Error');
        });

        await expect(() =>
          mongoDbRepository.findOneAndUpdate({}, {}),
        ).rejects.toThrow('Error');
      });
    });
  });

  describe('#READ_ALL', () => {
    describe('When  readAll function is called with a query', () => {
      it('Should call find at least once', async () => {
        const query = { skip: 1, limit: 10, value: 'any_value' };

        await mongoDbRepository.readAll(query);

        expect(model.find).toHaveBeenCalled();
      });
    });

    describe('When query rest is undefined and limit is greater than total', () => {
      it('Should throw HttpException', async () => {
        const query = { skip: 0, limit: 100 };
        const total = 20;
        jest
          .spyOn(model, 'countDocuments')
          .mockReturnValue({ exec: jest.fn().mockResolvedValue(total) });

        await mongoDbRepository.readAll(query);

        expect(model.find).toHaveBeenCalled();
      });
    });

    describe('When some error ocours', () => {
      it('should throw HttpException', async () => {
        model.countDocuments.mockImplementation(() => ({ exec: () => 1 }));
        model.find.mockImplementation(() => {
          throw new Error('Error');
        });

        await expect(() => mongoDbRepository.readAll({}, {})).rejects.toThrow(
          'Error',
        );
      });
    });
  });

  describe('#COUNT', () => {
    describe('When count is called with correct filters', () => {
      it('Should call countDocuments at least once', async () => {
        model.countDocuments.mockImplementation(() => ({ exec: () => 1 }));
        await mongoDbRepository.count({});

        expect(model.countDocuments).toHaveBeenCalled();
      });
    });

    describe('When some error ocours', () => {
      it('should throw HttpException', async () => {
        model.countDocuments.mockImplementation(() => {
          throw new Error('Error');
        });

        await expect(() => mongoDbRepository.count({})).rejects.toThrow(
          'Error',
        );
      });
    });
  });
});
