import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { ConfigService } from './config.service';
import { PaymentService } from './payment.service';
import { PaginationParamsDto } from 'src/common/dtos';
import { QueryRunner, Repository } from 'typeorm';
import { Customer, MeterReading, Invoice } from '../entities';
import { InjectRepository } from '@nestjs/typeorm';

interface invoiceConsumptionProps {
  queryRunner: QueryRunner;
  customer: Customer;
  service: MeterReading;
  consumption: number;
}
@Injectable()
export class InvoiceService {
  constructor(@InjectRepository(Invoice) private invoiceRespository: Repository<Invoice>) {
    // private configService: ConfigService, // @InjectModel(Payment.name) private paymentModel: Model<Payment>, // @InjectModel(Customer.name) private customerModel: Model<Customer>, // @InjectModel(Invoice.name) private invoiceModel: Model<Invoice>, // @InjectConnection() private connection: Connection,
    // private paymentService: PaymentService,
  }

  async generateConsumptionInvoice({ queryRunner, customer, service, consumption }: invoiceConsumptionProps) {
    const { preferences, minimumPrice } = customer.type;
    const interval = preferences.find(({ maxUnits, minUnits }) => consumption >= minUnits && consumption < maxUnits);
    if (!interval) throw new BadRequestException(`No range for reading: ${consumption}`);
    const amount = consumption * interval.priceByUnit;
    const createdInvoice = queryRunner.manager.create(Invoice, {
      customer: customer,
      amount: amount > minimumPrice ? amount : minimumPrice,
      service: service,
    });
    await queryRunner.manager.save(createdInvoice);
  }

  async getUnpaidInvoicesByCustomer(customerId: string) {
    return await this.invoiceRespository.find({ where: { customerId: customerId }, relations: { service: true } });
  }

  async payInvoices(id_invoices: string[], id_client: string) {
    // const { invoices, customer } = await this._checkInvalidInvoiceToPay(id_invoices, id_client);
    // const session = await this.connection.startSession();
    // try {
    //   session.startTransaction();
    //   await this.invoiceModel.updateMany(
    //     { _id: { $in: invoices.map((el) => el._id) } },
    //     { $set: { status: InvoiceStatus.PAID } },
    //     { session },
    //   );
    //   const payments = await this.paymentService.create(invoices, customer._id, session);
    //   await session.commitTransaction();
    //   return payments;
    // } catch (error) {
    //   console.log(error);
    //   await session.abortTransaction();
    //   throw new InternalServerErrorException('Error al realizar el pago');
    // } finally {
    //   session.endSession();
    // }
  }

  async getHistoryByCustomer(id_customer: string, { limit, offset }: PaginationParamsDto) {
    // return await this.paymentModel
    //   .find({ customer: id_customer })
    //   .populate('invoices customer')
    //   .sort({ issue_date: -1 })
    //   .skip(offset)
    //   .limit(limit);
  }

  private async _calculateConsumptionAmount(consumption: number): Promise<any> {
    // const { maxUnits, basePrice, pricePerExcessUnit } = await this.configService.getSettings();
    // if (consumption < maxUnits) return basePrice;
    // const additionalPayent = (consumption - maxUnits) * pricePerExcessUnit;
    // return basePrice + additionalPayent;
  }

  private async _checkInvalidInvoiceToPay(id_invoices: string[], id_client: string) {
    // const customer = await this.customerModel.findOne({ _id: id_client });
    // if (!customer) throw new BadRequestException('El afiliado no existe');
    // const invoicesToPay = await this.invoiceModel.find({ _id: { $in: id_invoices } });
    // const isInvalidInvoice = invoicesToPay.some(
    //   ({ status, client }) => status !== InvoiceStatus.PENDING || String(client._id) !== id_client,
    // );
    // if (isInvalidInvoice) throw new BadRequestException('Montos invalidos, Revise los pagos realizados');
    // return { invoices: invoicesToPay, customer };
  }
}
