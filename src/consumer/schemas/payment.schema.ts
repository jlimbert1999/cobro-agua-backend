// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import mongoose, { Document } from 'mongoose';
// import { Invoice, Customer } from './';

// @Schema()
// export class Payment extends Document {
//   @Prop({
//     type: String,
//     required: true,
//     unique: true,
//   })
//   code: string;

//   @Prop({
//     type: mongoose.Schema.Types.ObjectId,
//     ref: Customer.name,
//     required: true,
//   })
//   customer: Customer;

//   @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: Invoice.name }] })
//   invoices: Invoice[];

//   @Prop({
//     type: Date,
//     required: true,
//     default: Date.now,
//   })
//   payment_date: Date;

//   @Prop({
//     required: true,
//     type: Number,
//   })
//   amount: number;
// }

// export const PaymentSchema = SchemaFactory.createForClass(Payment);
