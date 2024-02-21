import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthDTO } from './dto/auth.dto';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserCreateUseCase } from '../../../src/application/useCases/user/create';
import { GetUserUseCase } from '../../../src/application/useCases/user/get';
import { faker } from '@faker-js/faker';

describe('==> Auth controller', () => {
  let authController: AuthController;
  let authService: AuthService;
  let authDto: AuthDTO;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UserService,
        JwtService,
        UserCreateUseCase,
        GetUserUseCase,
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
    authDto = {
      email: faker.internet.email(),
      password: faker.internet.password(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#SIGN_IN', () => {
    describe('When user tries signin to get an access_token', () => {
      it('should call AuthService.signIn with correct data and return response', async () => {
        jest.spyOn(authService, 'signIn').mockResolvedValueOnce(authDto);

        const result = await authController.signIn(authDto);

        expect(authService.signIn).toHaveBeenCalledWith(authDto);
        expect(result).toEqual(authDto);
      });
    });
  });

  describe('#SIGN_UP', () => {
    describe('When request receive a valid email and password', () => {
      it('should call AuthService.signup and save user', async () => {
        const expectedResponse = {
          status: 201,
          message: 'User created successfully',
          email: authDto.email,
        };
        jest
          .spyOn(authService, 'signUp')
          .mockResolvedValueOnce(expectedResponse);

        const result = await authController.signUp(authDto);

        expect(authService.signUp).toHaveBeenCalledWith(authDto);
        expect(result).toEqual(expectedResponse);
      });
    });
  });
});
