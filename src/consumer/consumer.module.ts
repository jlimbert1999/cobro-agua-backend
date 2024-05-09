import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConsumerService } from './consumer.service';
import { ConsumerController } from './consumer.controller';
import {
  Action,
  ActionSchema,
  Client,
  ClientSchema,
  Reading,
  ReadingSchema,
} from './schemas';
import { ActionService } from './services/action.service';
import { ActionController } from './controllers/action.controller';
import { ClientController } from './controllers/client.controller';
import { ClientService } from './services';

@Module({
  controllers: [ConsumerController, ActionController, ClientController],
  providers: [ConsumerService, ActionService, ClientService],
  imports: [
    MongooseModule.forFeature([
      { name: Action.name, schema: ActionSchema },
      { name: Client.name, schema: ClientSchema },
      { name: Reading.name, schema: ReadingSchema },
    ]),
  ],
})
export class ConsumerModule {}
