import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ReadingService } from '../services';
import { CreateReadingDto } from '../dto';

@Controller('readings')
export class ReadingController {
  constructor(private readingService: ReadingService) {}
  @Get('last/:id_client')
  getLastReading(@Param('id_client') id_client: string) {
    return this.readingService.getLastConsumptionRecord(id_client);
  }

  @Get('debts/:id_client')
  getDebtsByClient(@Param('id_client') id_client: string) {
    return this.readingService.getDebts(id_client);
  }

  @Post()
  create(@Body() reading: CreateReadingDto) {
    return this.readingService.create(reading);
  }
}
