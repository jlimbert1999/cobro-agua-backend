import { Controller, Get, Query } from '@nestjs/common';
import { PaymentService } from '../payment/payment.service';

@Controller('reports')
export class ReportController {
  constructor(private paymentService: PaymentService) {}
  @Get('payments/range')
  async getPaymentsByDateRange(@Query('start') startDate: string, @Query('end') endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return this.paymentService.getPaymentsByRange(start, end);
  }
}
