import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Customer } from './customer.schema';

export type ReadingDocument = HydratedDocument<Reading>;

@Schema()
export class Reading {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true,
  })
  client: Customer;

  @Prop({
    type: Number,
    required: true,
  })
  consume: number;

  @Prop({
    type: Date,
    required: true,
  })
  consumptionDate: Date;

  @Prop({
    type: Number,
    required: true,
  })
  amountToPay: number;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPaid: boolean;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);
