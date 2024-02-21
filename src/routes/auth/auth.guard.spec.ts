import { AuthGuard } from './auth.guard';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('==> Auth guard', () => {
  let authGuard: AuthGuard;
  let jwtService: JwtService;

  beforeAll(() => {
    jwtService = {
      verifyAsync: jest.fn(),
    } as unknown as JwtService;

    authGuard = new AuthGuard(jwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('#CAN_ACTIVATE', () => {
    describe('When token exist and is valid', () => {
      it('should return true', async () => {
        const token = 'mockToken';
        const payload = { sub: '123456', username: 'testuser' };
        const context = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
              headers: { authorization: `Bearer ${token}` },
            }),
          }),
        } as unknown as ExecutionContext;

        jest
          .spyOn(jwtService, 'verifyAsync')
          .mockImplementation(() => Promise.resolve(payload));

        const result = await authGuard.canActivate(context);

        expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
          secret: process.env.JWT_SECRET,
        });
        expect(result).toBe(true);
      });
    });

    describe('When token is missing', () => {
      it('should throw UnauthorizedException', async () => {
        const context = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
              headers: {},
            }),
          }),
        } as unknown as ExecutionContext;

        await expect(authGuard.canActivate(context)).rejects.toThrowError(
          UnauthorizedException,
        );
      });
    });

    describe('When token is invalid', () => {
      it('should throw UnauthorizedException', async () => {
        const token = 'mockToken';
        const context = {
          switchToHttp: jest.fn().mockReturnValue({
            getRequest: jest.fn().mockReturnValue({
              headers: { authorization: `Bearer ${token}` },
            }),
          }),
        } as unknown as ExecutionContext;
        jest
          .spyOn(jwtService, 'verifyAsync')
          .mockImplementation(() => Promise.reject(new Error()));

        await expect(authGuard.canActivate(context)).rejects.toThrowError(
          UnauthorizedException,
        );
      });
    });
  });
});
