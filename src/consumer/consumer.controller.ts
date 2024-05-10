import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { CreateReadingDto, UpdateReadingDto } from './dto';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

  @Post('reading')
  createReading(@Body() reading: CreateReadingDto) {
    return this.consumerService.createReading(reading);
  }


  @Get('clients')
  getClients() {
    return this.consumerService.getClients();
  }

  @Get('record/last/:id_action')
  getLastConsumptionRecord(@Param('id_action') id_action: string) {
    return this.consumerService.getLastConsumptionRecord(id_action);
  }

  @Get('debts/:id_action')
  getActionDebts(@Param('id_action') id_action: string) {
    return this.consumerService.getActionDebts(id_action);
  }

  @Put('pay/debts')
  payDebts(@Body() body: UpdateReadingDto) {
    return this.consumerService.payDebts(body.readingsIds);
  }
}
