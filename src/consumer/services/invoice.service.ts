import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { Customer, Invoice, InvoiceStatus, MeterReading, Payment } from '../schemas';
import { ConfigService } from './config.service';
import { PaymentService } from './payment.service';
import { PaginationParamsDto } from 'src/common/dtos';

interface createInvoiceProps {
  id_client: string;
  id_service: string;
  consumption: number;
  session: ClientSession;
}
@Injectable()
export class InvoiceService {
  constructor(
    @InjectConnection() private connection: Connection,
    @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
    @InjectModel(Customer.name) private customerModel: Model<Customer>,
    @InjectModel(Payment.name) private paymentModel: Model<Payment>,
    private configService: ConfigService,
    private paymentService: PaymentService,
  ) {}

  async generateConsumptionInvoice({ id_client, id_service, consumption, session }: createInvoiceProps) {
    const amount = await this._calculateConsumptionAmount(consumption);
    const code = await this.invoiceModel.countDocuments();
    const createdInvoice = new this.invoiceModel({
      code: `${code + 1}`,
      client: id_client,
      service: id_service,
      category: MeterReading.name,
      amount,
    });
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

  async getHistoryByCustomer(id_customer: string, { limit, offset }: PaginationParamsDto) {
    return await this.paymentModel
      .find({ customer: id_customer })
      .populate('invoices customer')
      .sort({ issue_date: -1 })
      .skip(offset)
      .limit(limit);
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
