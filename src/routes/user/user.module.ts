import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MongoDbRepository } from '../../infra/db/mongodb.repository';
import { UserShema } from '../../infra/db/schemas/user.schema';
import { UserCreateUseCase } from '../../application/useCases/user/create';
import { IDatabaseRepository } from '../../domain/interfaces/database.repository';
import { IUser } from '../../domain/interfaces/user-interface';
import { Model } from 'mongoose';
import { GetUserUseCase } from '../../application/useCases/user/get';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserShema }])],
  controllers: [],
  providers: [
    UserService,
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
        return new UserCreateUseCase(repository);
      },
      inject: [MongoDbRepository],
    },
  ],
})
export class UserModule {}
