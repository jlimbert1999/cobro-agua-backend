import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

import { HydratedDocument } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  OFFICER = 'officer',
}

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User extends Document {
  @Prop({
    required: true,
    type: String,
    uppercase: true,
  })
  fullname: string;

  @Prop({
    type: [String],
    enum: UserRole,
    default: [UserRole.OFFICER],
  })
  roles: UserRole[];

  @Prop({
    type: String,
    unique: true,
  })
  login: string;

  @Prop({
    type: String,
  })
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
