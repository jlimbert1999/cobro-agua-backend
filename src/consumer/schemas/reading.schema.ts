import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { Client } from './client.schema';

export type ReadingDocument = HydratedDocument<Reading>;

@Schema()
export class Reading {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: Client.name,
    required: true,
  })
  client: Client;

  @Prop({
    type: Number,
    required: true,
  })
  consume: number;


  @Prop({
    type: Date,
    required: true,
    default: Date.now,
  })
  consumptionDate: Date;

  @Prop({
    type: Boolean,
    default: false,
  })
  isPaid: boolean;
}

export const ReadingSchema = SchemaFactory.createForClass(Reading);
