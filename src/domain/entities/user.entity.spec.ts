import { faker } from '@faker-js/faker';

import { UserEntity } from './user.entity';
import { IUser } from '../interfaces/user-interface';

describe('==> User entity', () => {
  let user: IUser;
  beforeAll(() => {
    user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  describe('#CREATE', () => {
    describe('When UserEntity create is called with user data', () => {
      it('Should return a user data object', () => {
        const userEntity = UserEntity.create(user);
        expect(userEntity.user).toEqual(user);
      });
    });

    describe('When UserEntity create is called with any information', () => {
      it('Should return a user data object', () => {
        const userEntity = UserEntity.create(null);
        expect(userEntity.user).toEqual({});
      });
    });
  });

  describe('#TOJSON', () => {
    describe('When create is call with user data', () => {
      it('ToJson should return this user data', () => {
        const userEntity = UserEntity.create(user);
        const json = userEntity.toJSON();
        expect(json).toEqual(user);
      });
    });
  });
});
