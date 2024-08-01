import { BadRequestException, HttpException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, IsNull, QueryRunner, Repository } from 'typeorm';

import { PaymentService } from 'src/payment/payment.service';
import { PaginationParamsDto } from 'src/common/dtos';
import { Customer, MeterReading, Invoice } from '../entities';

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
    const interval = preferences.find(({ maxUnits, minUnits }) => consumption >= minUnits && consumption <= maxUnits);
    if (!interval) {
      throw new BadRequestException(`No range for reading: ${consumption}`);
    }
    const amount = consumption * interval.priceByUnit;
    const createdInvoice = queryRunner.manager.create(Invoice, {
      customer: customer,
      amount: amount > minimumPrice ? amount : minimumPrice,
      service: service,
    });
    await queryRunner.manager.save(createdInvoice);
  }

  async getUnpaidInvoicesByCustomer(customerId: string) {
    return await this.invoiceRespository.find({
      where: { customerId: customerId },
      relations: { service: true },
      order: { service: { createdAt: 'DESC' } },
    });
  }

  async payInvoices(invoiceIds: number[], customerId: string) {
    const customer = await this.customerRespository.findOneBy({ id: customerId });
    if (!customer) throw new BadRequestException(`Customer ${customerId} dont exist`);
    const invoices = await this._checkInvalidInvoiceToPay(invoiceIds, customerId);
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    try {
      await queryRunner.startTransaction();
      const payment = await this.paymentService.create({ queryRunner, customer, invoices });
      await queryRunner.manager.update(Invoice, { id: In(invoices.map(({ id }) => id)) }, { payment: payment });
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

  private async _checkInvalidInvoiceToPay(invoiceIds: number[], customerId: string) {
    const invoicesToPay = await this.invoiceRespository.find({ where: { id: In(invoiceIds), customerId: customerId } });
    const isInvalidInvoice = invoicesToPay.some(({ paymentId }) => paymentId);
    if (isInvalidInvoice) throw new BadRequestException('Invalid invoice');
    return invoicesToPay;
  }
}
