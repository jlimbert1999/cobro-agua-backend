import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ConfigDocument = HydratedDocument<Config>;

@Schema()
export class Config {
  @Prop({
    required: true,
    type: Number,
  })
  basePrice: number;

  @Prop({
    required: true,
    type: Number,
  })
  maxUnits: number;

  @Prop({
    required: true,
    type: Number,
  })
  pricePerExcessUnit: number;

  @Prop({
    required: true,
    type: Number,
  })
  maxDelayMonths: number;
}

export const ConfigSchema = SchemaFactory.createForClass(Config);
