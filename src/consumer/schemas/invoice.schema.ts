// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';
// import { Customer } from './customer.schema';
// import { MeterReading } from './meter-reading.schema';

// export enum InvoiceStatus {
//   PENDING = 'pending',
//   PAID = 'paid',
// }
// @Schema()
// export class Invoice extends Document {

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     ref: Customer.name,
//     required: true,
//   })
//   client: Customer;

//   @Prop({
//     type: Number,
//     required: true,
//   })
//   amount: number;

//   @Prop({
//     type: Date,
//     default: Date.now,
//   })
//   issue_date: Date;

//   @Prop({
//     type: String,
//     enum: InvoiceStatus,
//     default: InvoiceStatus.PENDING,
//   })
//   status: InvoiceStatus;

//   @Prop({
//     type: String,
//     required: true,
//     enum: [MeterReading.name],
//   })
//   category: string;

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     required: true,
//     refPath: 'category',
//   })
//   service: MeterReading;
// }

// export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
