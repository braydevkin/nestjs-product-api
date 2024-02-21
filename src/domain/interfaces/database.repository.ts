export type ReadAllResponse<Entity> = {
  total: number;
  limit: number;
  skip: number;
  results?: number;
  data: Entity[];
};

export interface IDatabaseRepository<Entity> {
  create: (data: Entity) => Promise<void>;
  createMany?: (entities: Entity[]) => Promise<void>;
  findOneAndUpdate?: (
    query: Partial<Entity>,
    data: Partial<Entity>,
  ) => Promise<void>;
  read: (query: Partial<Entity>) => Promise<Entity>;
  readAll?: (query: Partial<Entity>) => Promise<ReadAllResponse<Entity>>;
  delete?: (_id: string) => Promise<Entity>;
  count?: (query: Partial<Entity>) => Promise<number>;
  update?: (_id: string, data: Entity) => Promise<void>;
}
