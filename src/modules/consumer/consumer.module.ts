import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { ClientController, ReadingController, PaymentController } from './controllers';
import { CustomerService, InvoiceService, ReadingService, TaskService } from './services';
import { Customer, Invoice, MeterReading } from './entities';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { AdministrationModule } from 'src/modules/administration/administration.module';

@Module({
  controllers: [ConsumerController, ClientController, ReadingController, PaymentController],
  providers: [ConsumerService, CustomerService, ReadingService, InvoiceService, TaskService],
  imports: [TypeOrmModule.forFeature([Customer, Invoice, MeterReading]), AdministrationModule, PaymentModule],
  exports: [TypeOrmModule],
})
export class ConsumerModule {}
