import { Controller, Post, Body, Patch, Get, Param, Query } from '@nestjs/common';
import { CustomerService } from '../services';
import { CreateClientDto, FilterCustomerDto, UpdateClientDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';
import { CustomerTypeService, DiscountService } from 'src/modules/administration/services';

@Controller('clients')
export class ClientController {
  constructor(
    private clientService: CustomerService,
    private customerTypeService: CustomerTypeService,
    private discountService: DiscountService,
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
    return this.clientService.update(+id, client);
  }

  @Get('types')
  searchTypesCustomers(@Query('term') term?: string) {
    return this.customerTypeService.searchAvailables(term);
  }

  @Get('discounts')
  getDiscounts() {
    return this.discountService.getEnabled();
  }

  @Get('meter/:term')
  searchByMeterNumber(@Param('term') term: string) {
    return this.clientService.searchByMeterNumber(term);
  }
}
