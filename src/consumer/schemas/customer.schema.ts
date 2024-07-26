// import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
// import { Document, HydratedDocument } from 'mongoose';

// export enum CustomerStatus {
//   ENABLED = 'enabled',
//   DISABLED = 'disabled',
// }

// export type ClientDocument = HydratedDocument<Customer>;

// @Schema()
// export class Customer extends Document {
//   @Prop({
//     required: true,
//     type: String,
//     uppercase: true,
//   })
//   firstname: string;

//   @Prop({
//     type: String,
//     required: true,
//     uppercase: true,
//   })
//   middlename: string;

//   @Prop({
//     type: String,
//     uppercase: true,
//   })
//   lastname: number;

//   @Prop({
//     required: true,
//     type: String,
//     unique: true,
//   })
//   dni: string;

//   @Prop({
//     required: true,
//     type: Number,
//   })
//   phone: number;

//   @Prop({
//     required: true,
//     type: String,
//   })
//   address: string;

//   @Prop({
//     required: true,
//     enum: Object.values(CustomerStatus),
//     default: CustomerStatus.ENABLED,
//   })
//   status: CustomerStatus;
// }

// export const CustomertSchema = SchemaFactory.createForClass(Customer);
