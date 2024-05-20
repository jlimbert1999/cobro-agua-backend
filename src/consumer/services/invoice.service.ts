import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Customer, Invoice, InvoiceStatus } from '../schemas';
import { ConfigService } from './config.service';
import { PaymentService } from './payment.service';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    private configService: ConfigService,
    private paymentService: PaymentService,
  ) {}

  async generateConsumptionInvoice(id_client: string, consumption: number, session: ClientSession) {
    const amount = await this._calculateConsumptionAmount(consumption);
    const createdInvoice = new this.invoiceModel({ client: id_client, amount });
    return await createdInvoice.save({ session });
  }

  async getUnpaidInvoicesByCustomer(id_client: string) {
    return await this.invoiceModel.find({ client: id_client, status: InvoiceStatus.PENDING });
  }

  async payInvoices(id_invoices: string[], id_client: string) {
    const { invoices, customer } = await this._checkInvalidInvoiceToPay(id_invoices, id_client);
    const session = await this.connection.startSession();
    try {
      session.startTransaction();
      await this.invoiceModel.updateMany(
        { _id: { $in: invoices.map((el) => el._id) } },
        { $set: { status: InvoiceStatus.PAID } },
        { session },
      );
      const payments = await this.paymentService.create(invoices, customer._id, session);
      await session.commitTransaction();
      return payments;
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
      throw new InternalServerErrorException('Error al realizar el pago');
    } finally {
      session.endSession();
    }
  }

  private async _calculateConsumptionAmount(consumption: number): Promise<number> {
    const { maxUnits, basePrice, pricePerExcessUnit } = await this.configService.getSettings();
    if (consumption < maxUnits) return basePrice;
    const additionalPayent = (consumption - maxUnits) * pricePerExcessUnit;
    return basePrice + additionalPayent;
  }

  private async _checkInvalidInvoiceToPay(id_invoices: string[], id_client: string) {
    const customer = await this.customerModel.findOne({ _id: id_client });
    if (!customer) throw new BadRequestException('El afiliado no existe');
    const invoicesToPay = await this.invoiceModel.find({ _id: { $in: id_invoices } });
    const isInvalidInvoice = invoicesToPay.some(
      ({ status, client }) => status !== InvoiceStatus.PENDING || String(client._id) !== id_client,
    );
    if (isInvalidInvoice) throw new BadRequestException('Montos invalidos, Revise los pagos realizados');
    return { invoices: invoicesToPay, customer };
  }
}
