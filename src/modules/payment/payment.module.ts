import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { Payment } from './entities/payment.entity';

@Module({
  controllers: [PaymentController],
  providers: [PaymentService],
  imports: [TypeOrmModule.forFeature([Payment])],
  exports: [PaymentService],
})
export class PaymentModule {}
