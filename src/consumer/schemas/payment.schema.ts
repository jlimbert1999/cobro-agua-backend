import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Invoice } from './invoice.schema';

@Schema()
export class Payment extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Invoice.name,
    required: true,
  })
  invoice: Invoice;

  @Prop({
    type: Date,
    required: true,
  })
  payment_date: Date;

  @Prop({
    required: true,
    type: Number,
  })
  amount: number;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
