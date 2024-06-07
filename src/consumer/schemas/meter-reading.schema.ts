import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Customer } from './customer.schema';

@Schema()
export class MeterReading extends Document {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Customer.name,
    required: true,
  })
  client: Customer;

  @Prop({
    type: Date,
    required: true,
  })
  reading_date: Date;

  @Prop({
    type: Number,
    required: true,
  })
  previous_reading: number;

  @Prop({
    type: Number,
    required: true,
  })
  current_reading: number;

  @Prop({
    type: Number,
    required: true,
  })
  consumption: number;
}

export const MeterReadingSchema = SchemaFactory.createForClass(MeterReading);
