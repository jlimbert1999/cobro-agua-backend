/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { InvoiceService } from '../services';
import { UpdateInvoiceDto } from '../dtos';
import { PaginationParamsDto } from 'src/common/dtos';

@Controller('invoices')
export class PaymentController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('unpaid/:id_customer')
  getUnpaidInvoicesByCustomer(@Param('id_customer') id_customer: string) {
    return this.invoiceService.getUnpaidInvoicesByCustomer(id_customer);
  }

  @Get('history/:id_customer')
  getHistoryByCustomer(@Param('id_customer') id_customer: string, @Query() { limit, offset }: PaginationParamsDto) {
    return this.invoiceService.getHistoryByCustomer(id_customer, { limit, offset });
  }

  @Post('pay/:id_customer')
  payInvoices(@Param('id_customer') id_customer: string, @Body() { id_invoices }: UpdateInvoiceDto) {
    return this.invoiceService.payInvoices(id_invoices, id_customer);
  }
}
