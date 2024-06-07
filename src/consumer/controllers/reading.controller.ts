import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ReadingService } from '../services';
import { CreateReadingDto } from '../dto';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('readings')
export class ReadingController {
  constructor(private readingService: ReadingService) {}

  @Get('previus/:id_customer')
  getPreviusReading(@Param('id_customer') id_customer: string) {
    return this.readingService.getPreviusReading(id_customer);
  }

  @Get(':id_customer')
  getReadingsByCustomer(@Param('id_customer') id_client: string, @Query() params: PaginationParamsDto) {
    return this.readingService.getReadingsByClient(id_client, params);
  }

  @Post()
  create(@Body() reading: CreateReadingDto) {
    return this.readingService.create(reading);
  }

  @Post('upload')
  upload(@Body() data: any[]) {
    return this.readingService.upload(data);
  }
}
