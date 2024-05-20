/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { InvoiceService } from '../services';
import { UpdateInvoiceDto } from '../dto';

@Controller('invoices')
export class PaymentController {
  constructor(private invoiceService: InvoiceService) {}

  @Get('unpaid/:id_customer')
  getUnpaidInvoicesByCustomer(@Param('id_customer') id_customer: string) {
    return this.invoiceService.getUnpaidInvoicesByCustomer(id_customer);
  }

  @Post('pay/:id_customer')
  payInvoices(@Param('id_customer') id_customer: string, @Body() { id_invoices }: UpdateInvoiceDto) {
    return this.invoiceService.payInvoices(id_invoices, id_customer);
  }
}
