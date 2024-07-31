import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReadingService } from '../services';
import { CreateReadingDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';
import { CustomerTypeService } from 'src/administration/services';

@Controller('readings')
export class ReadingController {
  constructor(
    private readingService: ReadingService,
    private customerTypeService: CustomerTypeService,
  ) {}

  @Get('previus/:id_customer')
  getPreviusReading(@Param('id_customer') id_customer: string) {
    return this.readingService.getLastReading(id_customer);
  }

  @Get(':id_customer')
  getReadingsByCustomer(@Param('id_customer') id_client: string, @Query() params: PaginationParamsDto) {
    return this.readingService.getReadingsByClient(id_client, params);
  }

  @Post()
  create(@Body() reading: CreateReadingDto) {
    return this.readingService.create(reading);
  }

  @Get('customer-type/:id')
  getCustomerType(@Param('id') id: string) {
    return this.customerTypeService.getCustomerType(+id);
  }
}
