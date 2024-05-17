import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export enum ClientStatus {
  ENABLED = 'enabled',
  DISABLED = 'disabled',
}

export type ClientDocument = HydratedDocument<Customer>;

@Schema()
export class Customer {
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
    type: String,
    unique: true,
  })
  dni: string;

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

  @Prop({
    required: true,
    enum: Object.values(ClientStatus),
    default: ClientStatus.ENABLED,
  })
  status: ClientStatus;
}

export const CustomertSchema = SchemaFactory.createForClass(Customer);
