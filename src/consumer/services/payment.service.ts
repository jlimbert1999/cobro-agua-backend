import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invoice, Payment } from '../schemas';
import { ClientSession, Model } from 'mongoose';

@Injectable()
export class PaymentService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<Payment>) {}

  async create(invoices: Invoice[], id_customer: string, session: ClientSession) {
    const amount: number = invoices.reduce((acc, prev) => acc + prev.amount, 0);
    const code = await this._generateCode();
    const createPayment = new this.paymentModel({
      code: code,
      amount: amount,
      invoices: invoices.map(({ _id }) => _id),
      customer: id_customer,
    });
    await createPayment.save({ session });
    return await this.paymentModel.populate(createPayment, 'invoices customer');
  }

  private async _generateCode(): Promise<string> {
    const correlative = await this.paymentModel.countDocuments();
    return `${correlative + 1}`;
  }
}
