import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import {
  HttpException,
  HttpStatus,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/domain/interfaces/user-interface';

describe('==> Auth service', () => {
  let authService: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let login: Omit<IUser, '_id'>;
  let user: IUser;

  beforeAll(() => {
    userService = {
      readOne: jest.fn(),
      create: jest.fn(),
    } as unknown as UserService;

    jwtService = {
      signAsync: jest.fn().mockResolvedValue('mockToken'),
    } as unknown as JwtService;

    authService = new AuthService(userService, jwtService);
    login = { email: 'test@example.com', password: 'password' };
    user = {
      _id: 'any_id',
      email: 'test@example.com',
      password: 'hashedPassword',
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#SIGN_IN', () => {
    describe('When user signin with a valid credentials', () => {
      it('should sign in user and return token if credentials are correct', async () => {
        jest
          .spyOn(userService, 'readOne')
          .mockImplementation(() => Promise.resolve(user));
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(true));

        const result = await authService.signIn(login);

        expect(userService.readOne).toHaveBeenCalledWith({
          email: login.email,
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          login.password,
          user.password,
        );
        expect(jwtService.signAsync).toHaveBeenCalledWith({
          sub: user._id,
          username: user.email,
        });
        expect(result).toEqual({ access_token: 'mockToken' });
      });
    });

    describe('When user does not exist yet', () => {
      it('Should throw HttpException showing message and forbidden status', async () => {
        const login = {
          email: 'nonexistent@example.com',
          password: 'password',
        };
        jest
          .spyOn(userService, 'readOne')
          .mockImplementation(() => Promise.resolve(null));

        await expect(authService.signIn(login)).rejects.toThrow(
          new HttpException('User not exist', HttpStatus.FORBIDDEN),
        );
      });
    });

    describe('When password is incorrect', () => {
      it('Should throw UnauthorizedException', async () => {
        const login = { email: 'test@example.com', password: 'wrongPassword' };
        const user = {
          _id: 'mockId',
          email: 'test@example.com',
          password: 'hashedPassword',
        };
        jest
          .spyOn(userService, 'readOne')
          .mockImplementation(() => Promise.resolve(user));
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(false));

        await expect(authService.signIn(login)).rejects.toThrow(
          new UnauthorizedException('Password is incorrect'),
        );
      });
    });
  });

  describe('#SIGN_UP', () => {
    describe('When user does not exist', () => {
      it('Should register it and save document', async () => {
        const registerInfo = {
          email: 'test@example.com',
          password: 'password',
        };

        const response = {
          status: HttpStatus.CREATED,
          message: 'User created successfully',
          email: registerInfo.email,
        };
        jest
          .spyOn(userService, 'readOne')
          .mockImplementation(() => Promise.resolve(null));

        jest
          .spyOn(userService, 'create')
          .mockImplementation(() => Promise.resolve(response));

        const result = await authService.signUp(registerInfo);

        expect(userService.readOne).toHaveBeenCalledWith({
          email: registerInfo.email,
        });
        expect(userService.create).toHaveBeenCalledWith({
          email: registerInfo.email,
          password: registerInfo.password,
        });
        expect(result).toEqual(response);
      });
    });

    describe('When user already exist', () => {
      it('Should return an HttpException', async () => {
        const registerInfo = {
          email: 'test@example.com',
          password: 'password',
        };

        jest.spyOn(userService, 'readOne').mockResolvedValue(registerInfo);

        await expect(authService.signUp(registerInfo)).rejects.toThrow(
          new HttpException('User already exists', HttpStatus.CONFLICT),
        );
      });
    });
  });
});
