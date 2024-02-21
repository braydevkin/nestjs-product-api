import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IProduct } from '../../../domain/interfaces';

export type ProductDocument = HydratedDocument<IProduct>;

@Schema()
export class Product implements Omit<IProduct, '_id'> {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  productId: string;

  @Prop()
  sku: string;

  @Prop()
  name: string;

  @Prop()
  brand: string;

  @Prop()
  model: string;

  @Prop()
  category: string;

  @Prop()
  color: string;

  @Prop()
  price: number;

  @Prop()
  currency: string;

  @Prop()
  stock: number;

  @Prop()
  createdAt: string;

  @Prop()
  updatedAt: string;

  @Prop()
  deletedAt?: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
