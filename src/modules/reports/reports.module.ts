/*
https://docs.nestjs.com/modules
*/
import { PaymentModule } from '../payment/payment.module';
import { ReportController } from './report.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PaymentModule],
  controllers: [ReportController],
  providers: [],
})
export class ReportsModule {}
