import { Injectable } from '@nestjs/common';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class PaymentService {
  constructor() {}

  async create(invoices: any[], id_customer: string, session: any) {
    // const amount: number = invoices.reduce((acc, prev) => acc + prev.amount, 0);
    // const code = await this._generateCode();
    // const createPayment = new this.paymentModel({
    //   code: code,
    //   amount: amount,
    //   invoices: invoices.map(({ _id }) => _id),
    //   customer: id_customer,
    // });
    // await createPayment.save({ session });
    // return await this.paymentModel.populate(createPayment, 'invoices customer');
  }

  private async _generateCode(): Promise<any> {
    // const correlative = await this.paymentModel.countDocuments();
    // return `${correlative + 1}`;
  }
}
