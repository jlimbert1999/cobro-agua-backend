import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @Prop({
    required: true,
    type: String,
    uppercase: true,
  })
  firstname: string;

  @Prop({
    type: String,
    required: true,
    uppercase: true,
  })
  middlename: string;

  @Prop({
    type: String,
    uppercase: true,
  })
  lastname: number;

  @Prop({
    required: true,
    type: Number,
    unique: true,
  })
  dni: number;

  @Prop({
    required: true,
    type: Number,
  })
  phone: number;

  @Prop({
    required: true,
    type: String,
  })
  address: string;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
