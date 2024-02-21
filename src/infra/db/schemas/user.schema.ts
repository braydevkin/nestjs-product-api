import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { IUser } from 'src/domain/interfaces/user-interface';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User implements Omit<IUser, '_id'> {
  _id: mongoose.Schema.Types.ObjectId;

  @Prop({ unique: true })
  email: string;

  @Prop()
  password: string;
}

export const UserShema = SchemaFactory.createForClass(User);
