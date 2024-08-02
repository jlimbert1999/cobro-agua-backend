import { Controller, Post, Body, Patch, Get, Param, Query } from '@nestjs/common';
import { CustomerService } from '../services';
import { CreateClientDto, FilterCustomerDto, UpdateClientDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';
import { CustomerTypeService } from 'src/modules/administration/services';

@Controller('clients')
export class ClientController {
  constructor(
    private clientService: CustomerService,
    private customerTypeService: CustomerTypeService,
  ) {}

  @Post('filter')
  findAll(@Query() params: PaginationParamsDto, @Body() data: FilterCustomerDto) {
    return this.clientService.findAll(params, data);
  }

  @Post()
  create(@Body() client: CreateClientDto) {
    return this.clientService.create(client);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() client: UpdateClientDto) {
    return this.clientService.update(id, client);
  }

  @Post('upload')
  upload(@Body() data: any[]) {
    return this.clientService.uploadData(data);
  }

  @Get('types')
  searchTypesCustomers(@Query('term') term?: string) {
    return this.customerTypeService.searchAvailables(term);
  }

  @Get('meter/:term')
  searchByMeterNumber(@Param('term') term: string) {
    return this.clientService.searchByMeterNumber(term);
  }
}
