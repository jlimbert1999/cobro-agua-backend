import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';

import { Customer, Invoice, CustomerStatus } from '../entities';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Customer) private customerRepository: Repository<Customer>,
    @InjectRepository(Invoice) private invoiceRepository: Repository<Invoice>,
  ) {}

  @Cron('0 0 * * *')
  async handleCron() {
    const users = await this.customerRepository.find({ select: { id: true }, relations: { type: true } });
    for (const user of users) {
      const totalPendingInvoices = await this.invoiceRepository.count({
        where: { customerId: user.id, paymentId: IsNull() },
      });
      if (totalPendingInvoices >= user.type.maxDelayMonths) {
        user.status = CustomerStatus.DISABLED;
        await this.customerRepository.save(user);
      }
    }
  }
}
