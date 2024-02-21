import { IDatabaseRepository, IProduct } from 'src/domain/interfaces';
import { ISummaryFilterProps } from 'src/domain/interfaces/summary-interface';

export class ProductSummaryUseCase {
  constructor(private repository: IDatabaseRepository<IProduct>) {}

  async execute({ query }: ISummaryFilterProps) {
    let queryRange = {};
    if (query.start_date || query.end_date) {
      queryRange = {
        deletedAt: { $exists: true } as any,
        createdAt: {
          $gte: query.start_date,
          $lte: query.end_date,
        } as any,
      };
    }

    const deletedCount = await this.repository.count(queryRange);

    return {
      deleted: deletedCount,
      message:
        deletedCount > 1
          ? ` ${deletedCount} Products has been deleted`
          : ` ${deletedCount} Product has been deleted`,
    };
  }
}
