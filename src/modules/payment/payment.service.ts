import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, QueryRunner, Repository } from 'typeorm';

import { Payment } from './entities/payment.entity';
import { Customer, Invoice } from 'src/modules/consumer/entities';
import { PaginationParamsDto } from 'src/common/dtos';

interface paymentProps {
  queryRunner: QueryRunner;
  customer: Customer;
  invoices: Invoice[];
}
@Injectable()
export class PaymentService {
  constructor(@InjectRepository(Payment) private paymentRepository: Repository<Payment>) {}

  async create({ queryRunner, customer, invoices }: paymentProps) {
    const amount: number = invoices.reduce((acc, prev) => acc + prev.amount, 0);
    const code = await this._generateCode();
    const createdPayment = queryRunner.manager.create(Payment, {
      code,
      amount,
      invoices,
      customer,
    });
    return await queryRunner.manager.save(createdPayment);
  }

  async getPaymentsByRange(startDate: Date, endDate: Date) {
    return this.paymentRepository.find({
      where: {
        createdAt: Between(startDate, endDate),
      },
      relations: ['customer'], // Agrega las relaciones si las necesitas en el resultado
    });
  }

  async histoty(customerId: string, { limit, offset }: PaginationParamsDto) {
    return await this.paymentRepository.find({
      where: { customerId: customerId },
      relations: { customer: { type: true }, invoices: { service: true } },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });
  }

  private async _generateCode(): Promise<string> {
    const correlative = await this.paymentRepository.count();
    return `${correlative + 1}`;
  }
}
