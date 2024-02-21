import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { UserCreateUseCase } from '../../application/useCases/user/create';
import { GetUserUseCase } from '../../application/useCases/user/get';

import { MongoDbRepository } from '../../infra/db/mongodb.repository';
import { UserShema } from '../../infra/db/schemas/user.schema';

import { IDatabaseRepository } from '../../domain/interfaces/database.repository';
import { IUser } from '../../domain/interfaces/user-interface';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

import { UserService } from '../user/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserShema }]),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION },
    }),
  ],
  controllers: [AuthController],
  providers: [
    UserService,
    AuthService,
    MongoDbRepository,
    {
      provide: MongoDbRepository,
      useFactory: (model: Model<IUser>) => {
        return new MongoDbRepository(model);
      },
      inject: [getModelToken('User')],
    },
    {
      provide: UserCreateUseCase,
      useFactory: (repository: IDatabaseRepository<IUser>) => {
        return new UserCreateUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
    {
      provide: GetUserUseCase,
      useFactory: (repository: IDatabaseRepository<IUser>) => {
        return new GetUserUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
