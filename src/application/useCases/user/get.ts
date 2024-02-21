import { IDatabaseRepository } from 'src/domain/interfaces/database.repository';
import { IUser } from 'src/domain/interfaces/user-interface';

export class GetUserUseCase {
  constructor(private repository: IDatabaseRepository<IUser>) {}

  async execute(query: Partial<IUser>): Promise<IUser> {
    return await this.repository.read(query);
  }
}
