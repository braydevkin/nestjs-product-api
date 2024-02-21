import { IDatabaseRepository, IProduct } from 'src/domain/interfaces';

export class ProductReadAllUseCase {
  constructor(private repository: IDatabaseRepository<IProduct>) {}

  async execute(query: Partial<IProduct>): Promise<any> {
    return await this.repository.readAll(query);
  }
}
