import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Roles } from '../interfaces/roles.enum';

@Schema()
export class User extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  login: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: true,
  })
  isActive: boolean;

  @Prop({
    type: [String],
    enum: Object.values(Roles),
    default: Roles.USER,
  })
  role: Roles;
}

export const UserSchema = SchemaFactory.createForClass(User);
