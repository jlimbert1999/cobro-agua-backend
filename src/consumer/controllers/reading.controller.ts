import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReadingService } from '../services';
import { CreateReadingDto } from '../dto';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('readings')
export class ReadingController {
  constructor(private readingService: ReadingService) {}

  @Get('last/:id_client')
  getPreviusReading(@Param('id_client') id_client: string) {
    return this.readingService.getPreviusReading(id_client);
  }

  @Get(':id_customer')
  getReadingsByCustomer(@Param('id_customer') id_client: string, @Query() params: PaginationParamsDto) {
    return this.readingService.getReadingsByClient(id_client, params);
  }

  @Post()
  create(@Body() reading: CreateReadingDto) {
    return this.readingService.create(reading);
  }
}
