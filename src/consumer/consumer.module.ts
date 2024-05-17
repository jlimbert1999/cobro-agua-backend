import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import {
  Customer,
  CustomertSchema,
  Config,
  ConfigSchema,
  Reading,
  ReadingSchema,
} from './schemas';
import {
  ClientController,
  ReadingController,
  ConfigController,
} from './controllers';
import { ClientService, ConfigService, ReadingService } from './services';

@Module({
  controllers: [
    ConsumerController,
    ClientController,
    ReadingController,
    ConfigController,
  ],
  providers: [ConsumerService, ClientService, ConfigService, ReadingService],
  imports: [
    MongooseModule.forFeature([
      { name: Customer.name, schema: CustomertSchema },
      { name: Reading.name, schema: ReadingSchema },
      { name: Config.name, schema: ConfigSchema },
    ]),
  ],
})
export class ConsumerModule {}
