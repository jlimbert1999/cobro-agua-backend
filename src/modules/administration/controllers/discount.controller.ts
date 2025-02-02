import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { DiscountService } from '../services';
import { PaginationParamsDto } from 'src/common/dtos';
import { CreateDiscountDto, UpdateDiscountDto } from '../dtos';

@Controller('discount')
export class DiscountController {
  constructor(private discountService: DiscountService) {}
  @Get()
  findAll(@Query() params: PaginationParamsDto) {
    return this.discountService.findAll(params);
  }

  @Post()
  create(@Body() discountDto: CreateDiscountDto) {
    return this.discountService.create(discountDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() discountDto: UpdateDiscountDto) {
    return this.discountService.update(+id, discountDto);
  }
}
