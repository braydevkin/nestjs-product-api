import { HttpException, HttpStatus } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  IDatabaseRepository,
  ReadAllResponse,
} from 'src/domain/interfaces/database.repository';

export class MongoDbRepository<Entity>
  implements Partial<IDatabaseRepository<Entity>>
{
  constructor(private model: Model<Entity>) {}

  async create(data: Entity): Promise<void> {
    try {
      (await this.model.create(data)).save();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOneAndUpdate(query: Partial<Entity>, data: Entity): Promise<void> {
    try {
      await this.model
        .findOneAndUpdate(query, data, {
          upsert: true,
          lean: true,
        })
        .exec();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async read(query: Entity): Promise<Entity> {
    try {
      return await this.model.findOne(query).exec();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async readAll(query: Partial<Entity>): Promise<ReadAllResponse<Entity>> {
    try {
      const { skip, limit, ...rest } = query as any;

      const total = await this.model.countDocuments(rest).exec();

      const data = await this.model.find(rest).limit(limit).skip(skip).exec();

      return {
        skip,
        limit,
        total,
        data,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async count(query: Entity): Promise<number> {
    try {
      return await this.model.countDocuments(query).exec();
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
