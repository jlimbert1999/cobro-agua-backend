import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { ClientController, ReadingController, ConfigController, PaymentController } from './controllers';
import {
  CustomerService,
  ConfigService,
  InvoiceService,
  ReadingService,
  PaymentService,
  TaskService,
} from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Invoice, MeterReading } from './entities';
import { AdministrationModule } from 'src/administration/administration.module';

@Module({
  controllers: [ConsumerController, ClientController, ReadingController, ConfigController, PaymentController],
  providers: [
    ConsumerService,
    CustomerService,
    ConfigService,
    ReadingService,
    InvoiceService,
    PaymentService,
    TaskService,
  ],
  imports: [TypeOrmModule.forFeature([Customer, Invoice, MeterReading]), AdministrationModule],
})
export class ConsumerModule {}
