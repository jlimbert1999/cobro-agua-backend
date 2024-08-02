import { Controller, Get, Body, Param, Put } from '@nestjs/common';
import { ConsumerService } from './consumer.service';
import { UpdateReadingDto } from './dtos';

@Controller('consumer')
export class ConsumerController {
  constructor(private readonly consumerService: ConsumerService) {}

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
