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
    const amount = this._calculateAmountToPay(consumption, preferences, minimumPrice);
    const createdInvoice = queryRunner.manager.create(Invoice, {
      customer: customer,
      service: service,
      amount: amount,
    });
    await queryRunner.manager.save(createdInvoice);
  }

  async getUnpaidInvoicesByCustomer(customerId: number) {
    return await this.invoiceRespository.find({
      where: { customerId: customerId, paymentId: IsNull() },
      relations: { service: true },
      order: { createdAt: 'DESC' },
    });
  }

  async pay(customerId: number, { invoiceIds }: PaymentDto) {
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
    return await this.paymentService.histoty(id_customer, paginatioParams);
  }

  private _calculateAmountToPay(consumption: number, preferences: Preference[], minimumPrice: number) {
    const sortedPreferences = preferences.slice().sort((a, b) => a.minUnits - b.minUnits);
    let total = 0;
    for (const range of sortedPreferences) {
      const rangeUnits = range.maxUnits - range.minUnits + (range.minUnits === 0 ? 0 : 1);
      if (consumption <= rangeUnits) {
        total += (consumption === 0 ? 1 : consumption) * range.priceByUnit;
        break;
      }
      total += rangeUnits * range.priceByUnit;
      consumption -= rangeUnits;
    }
    return total > minimumPrice ? total : minimumPrice;
  }

  private async _checkInvalidInvoiceToPay(invoiceIds: number[], customerId: number) {
    const invoicesToPay = await this.invoiceRespository.find({
      where: { id: In(invoiceIds), customerId: customerId },
      relations: { service: true },
    });
    const invalidInvoice = invoicesToPay.find(({ status, paymentId }) => status === InvoiceStatus.PAID || paymentId);
    if (invalidInvoice) throw new BadRequestException(`La factura Nro. ${invalidInvoice.id} ya ha sido cancelada`);
    return invoicesToPay;
  }
}
