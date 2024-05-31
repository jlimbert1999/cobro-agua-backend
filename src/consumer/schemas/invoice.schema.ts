import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, HydratedDocument } from 'mongoose';
import { Customer } from './customer.schema';

export type InvoiceDocument = HydratedDocument<Invoice>;
export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
}
@Schema()
export class Invoice extends Document {
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  code: string;

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
  amount: number;

  @Prop({
    type: Date,
    default: Date.now,
  })
  issue_date: Date;

  @Prop({
    type: String,
    enum: InvoiceStatus,
    default: InvoiceStatus.PENDING,
  })
  status: InvoiceStatus;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
