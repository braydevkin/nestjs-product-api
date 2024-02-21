import { UserEntity } from '../../../domain/entities/user.entity';
import { IDatabaseRepository } from '../../../domain/interfaces/database.repository';
import { IUser } from '../../../domain/interfaces/user-interface';

export class UserCreateUseCase {
  constructor(private repository: IDatabaseRepository<IUser>) {}

  async execute(input: IUser): Promise<IUser> {
    const entity = UserEntity.create(input);
    await this.repository.create(entity.user);
    return entity.toJSON();
  }
}
