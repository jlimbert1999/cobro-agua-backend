import { Module } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import { ClientController, ReadingController, ConfigController, PaymentController } from './controllers';
import { CustomerService, ConfigService, InvoiceService, ReadingService, TaskService } from './services';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer, Invoice, MeterReading } from './entities';
import { PaymentModule } from 'src/modules/payment/payment.module';
import { AdministrationModule } from 'src/modules/administration/administration.module';

@Module({
  controllers: [ConsumerController, ClientController, ReadingController, ConfigController, PaymentController],
  providers: [ConsumerService, CustomerService, ConfigService, ReadingService, InvoiceService, TaskService],
  imports: [TypeOrmModule.forFeature([Customer, Invoice, MeterReading]), AdministrationModule, PaymentModule],
  exports: [TypeOrmModule],
})
export class ConsumerModule {}
