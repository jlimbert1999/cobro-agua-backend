import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import {
  Customer,
  CustomertSchema,
  Config,
  ConfigSchema,
  MeterReading,
  MeterReadingSchema,
  InvoiceSchema,
  Invoice,
  PaymentSchema,
  Payment,
} from './schemas';
import { ClientController, ReadingController, ConfigController, PaymentController } from './controllers';
import { ClientService, ConfigService, InvoiceService, ReadingService, PaymentService, TaskService } from './services';

@Module({
  controllers: [ConsumerController, ClientController, ReadingController, ConfigController, PaymentController],
  providers: [ConsumerService, ClientService, ConfigService, ReadingService, InvoiceService, PaymentService, TaskService],
  imports: [
    // MongooseModule.forFeature([
    //   { name: MeterReading.name, schema: MeterReadingSchema },
    //   { name: Customer.name, schema: CustomertSchema },
    //   { name: Config.name, schema: ConfigSchema },
    //   { name: Invoice.name, schema: InvoiceSchema },
    //   { name: Payment.name, schema: PaymentSchema },
    // ]),
  ],
})
export class ConsumerModule {}
