import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, QueryRunner, Repository } from 'typeorm';

import { PaymentService } from 'src/modules/payment/payment.service';
import { Preference } from 'src/modules/administration/entities';
import { Customer, MeterReading, Invoice, InvoiceStatus } from '../entities';
import { PaginationParamsDto } from 'src/common/dtos';
import { PaymentDto } from '../dtos';

interface invoiceConsumptionProps {
  queryRunner: QueryRunner;
  customer: Customer;
  service: MeterReading;
  consumption: number;
}

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(Invoice) private invoiceRespository: Repository<Invoice>,
    @InjectRepository(Customer) private customerRespository: Repository<Customer>,
    private paymentService: PaymentService,
    private dataSource: DataSource,
  ) {}

  async generateConsumptionInvoice({ queryRunner, customer, service, consumption }: invoiceConsumptionProps) {
    const { preferences, minimumPrice } = customer.type;
    const amount = this._calculateAmountToPay(consumption, preferences);
    const createdInvoice = queryRunner.manager.create(Invoice, {
      customer: customer,
      service: service,
      amount: amount > minimumPrice ? amount : minimumPrice,
    });
    await queryRunner.manager.save(createdInvoice);
  }

  async getUnpaidInvoicesByCustomer(customerId: string) {
    return await this.invoiceRespository.find({
      where: { customerId: customerId, paymentId: IsNull() },
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }

  async pay(customerId: string, { invoiceIds }: PaymentDto) {
    const customer = await this.customerRespository.findOne({ where: { id: customerId }, relations: { type: true } });
    if (!customer) throw new BadRequestException(`Customer ${customerId} dont exist`);
    const invoices = await this._checkInvalidInvoiceToPay(invoiceIds, customerId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const payment = await this.paymentService.create({ queryRunner, customer, invoices });
      await queryRunner.manager.update(
        Invoice,
        { id: In(invoices.map(({ id }) => id)) },
        { payment: payment, status: InvoiceStatus.PAID },
      );
      await queryRunner.commitTransaction();
      return payment;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error payment invoice');
    } finally {
      await queryRunner.release();
    }
  }

  async getHistoryByCustomer(id_customer: string, paginatioParams: PaginationParamsDto) {
    return this.paymentService.histoty(id_customer, paginatioParams);
  }

  private _calculateAmountToPay(consumption: number, preferences: Preference[]) {
    const sortedPreferences = preferences.slice().sort((a, b) => a.minUnits - b.minUnits);
    let total = 0;
    for (const range of sortedPreferences) {
      total += range.priceByUnit;
      if (consumption <= range.maxUnits) break;
    }
    return total;
  }

  private async _checkInvalidInvoiceToPay(invoiceIds: number[], customerId: string) {
    const invoicesToPay = await this.invoiceRespository.find({
      where: { id: In(invoiceIds), customerId: customerId },
      relations: { service: true },
    });
    const invalidInvoice = invoicesToPay.find(({ status, paymentId }) => status === InvoiceStatus.PAID || paymentId);
    if (invalidInvoice) throw new BadRequestException(`La factura Nro. ${invalidInvoice.id} ya ha sido cancelada`);
    return invoicesToPay;
  }
}
