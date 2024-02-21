import { faker } from '@faker-js/faker';

import { UserCreateUseCase } from 'src/application/useCases/user/create';
import { GetUserUseCase } from 'src/application/useCases/user/get';
import { UserService } from './user.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn().mockReturnValue('hashedPassword'),
}));

describe('==> User service', () => {
  let user, userCreateUseCase, getUseCase, userService;
  beforeAll(() => {
    user = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
    userCreateUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<UserCreateUseCase>;

    getUseCase = {
      execute: jest.fn(),
    } as unknown as jest.Mocked<GetUserUseCase>;

    userService = new UserService(userCreateUseCase, getUseCase);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('#CREATE', () => {
    describe('When userCreateUseCase create is called with user data', () => {
      it('Should return create a user and return a success response', async () => {
        userCreateUseCase.execute.mockResolvedValueOnce({
          email: user.email,
        });

        const result = await userService.create(user);

        expect(userCreateUseCase.execute).toHaveBeenCalledWith({
          email: user.email,
          password: 'hashedPassword',
        });
        expect(result).toEqual({
          status: 201,
          message: 'User created successfully',
          email: user.email,
        });
      });
    });
  });

  describe('#READ_ONE', () => {
    describe('When getUseCase is called with correct filters', () => {
      it('Should return a valid user', async () => {
        const query = { email: user.email };

        getUseCase.execute.mockResolvedValueOnce(user);

        const result = await userService.readOne(query);

        expect(getUseCase.execute).toHaveBeenCalledWith(query);
        expect(result).toEqual(user);
      });
    });
  });
});
