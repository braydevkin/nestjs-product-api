import { IDatabaseRepository, IProduct } from 'src/domain/interfaces';

export class ProductSoftDeleteUseCase {
  constructor(private repository: IDatabaseRepository<IProduct>) {}

  async execute(_id: string) {
    await this.repository.findOneAndUpdate(
      { _id },
      { deletedAt: new Date().toISOString() },
    );
    return { deleted: true };
  }
}
