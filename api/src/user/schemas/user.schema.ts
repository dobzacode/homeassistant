import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { User as UserEntity } from '../entities/user.entity';

@Schema()
export class User extends UserEntity {
  @Prop({ unique: true })
  override userName: string;

  @Prop()
  override nickName?: string;

  @Prop()
  override email?: string;

  @Prop()
  override firstName?: string;

  @Prop()
  override lastName?: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
