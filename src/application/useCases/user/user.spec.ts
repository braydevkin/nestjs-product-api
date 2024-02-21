import { faker } from '@faker-js/faker';
import { UserEntity } from '../../../../src/domain/entities/user.entity';
import { UserCreateUseCase } from '../user/create';

import { GetUserUseCase } from './get';
import { IDatabaseRepository } from 'src/domain/interfaces/database.repository';
import { IUser } from 'src/domain/interfaces/user-interface';

describe('==> User use case', () => {
  let repository: IDatabaseRepository<IUser>;
  let dto: IUser;

  beforeAll(() => {
    repository = {
      create: jest.fn(),
      read: jest.fn(),
    };
    dto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  describe('#CREATE', () => {
    describe('execute()', () => {
      describe('When UserEntity create function is called', () => {
        it('Should return a JSON data', async () => {
          jest.spyOn(UserEntity, 'create').mockImplementation(() => ({
            toJSON: jest.fn().mockReturnValue(dto),
            user: dto,
          }));

          const userUseCase = new UserCreateUseCase(repository);
          const jsonData = await userUseCase.execute(dto);

          expect(jsonData).toBe(dto);
          expect(UserEntity.create).toHaveBeenCalled();
          expect(UserEntity.create).toHaveBeenCalledWith(dto);
          expect(repository.create).toHaveBeenCalled();
        });
      });
    });
  });

  describe('#GET', () => {
    it('When execute is call using email as query filter', async () => {
      jest
        .spyOn(repository, 'read')
        .mockImplementation(() => Promise.resolve(dto));

      const getUserUseCase = new GetUserUseCase(repository);
      const result = await getUserUseCase.execute({ email: dto.email });

      expect(result).toBe(dto);
      expect(repository.create).toHaveBeenCalled();
    });
  });
});
