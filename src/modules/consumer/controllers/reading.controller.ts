import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReadingService } from '../services';
import { CreateReadingDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('readings')
export class ReadingController {
  constructor(private readingService: ReadingService) {}

  @Get('previus/:id_customer')
  getPreviusReading(@Param('id_customer') id_customer: string) {
    return this.readingService.getLastReading(+id_customer);
  }

  @Get(':customerId')
  getReadingsByCustomer(@Param('customerId') customerId: string, @Query() params: PaginationParamsDto) {
    return this.readingService.getReadingsByClient(+customerId, params);
  }

  @Post()
  create(@Body() reading: CreateReadingDto) {
    return this.readingService.create(reading);
  }
}
