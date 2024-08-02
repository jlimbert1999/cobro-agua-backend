import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CreateCustomerTypeDto, UpdateCustomerTypeDto } from '../dtos';
import { CustomerTypeService } from '../services';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('customer-type')
export class CustomerTypeController {
  constructor(private customerTyperService: CustomerTypeService) {}

  @Get()
  findAll(@Query() params: PaginationParamsDto) {
    return this.customerTyperService.findAll(params);
  }

  @Post()
  create(@Body() customerTypeDto: CreateCustomerTypeDto) {
    return this.customerTyperService.create(customerTypeDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() customerTypeDto: UpdateCustomerTypeDto) {
    return this.customerTyperService.update(+id, customerTypeDto);
  }
}
