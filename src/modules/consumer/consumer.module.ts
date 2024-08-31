import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AdministrationModule } from 'src/modules/administration/administration.module';
import { PaymentModule } from 'src/modules/payment/payment.module';

import { CustomerService, InvoiceService, ReadingService, TaskService } from './services';
import { ClientController, ReadingController, PaymentController } from './controllers';
import { Customer, Invoice, MeterReading } from './entities';

@Module({
  controllers: [ClientController, ReadingController, PaymentController],
  providers: [CustomerService, ReadingService, InvoiceService, TaskService],
  imports: [TypeOrmModule.forFeature([Customer, Invoice, MeterReading]), AdministrationModule, PaymentModule],
  exports: [TypeOrmModule],
})
export class ConsumerModule {}
