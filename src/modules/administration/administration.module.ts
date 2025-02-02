import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerType, Discount, Preference } from './entities';
import { CustomerTypeService, DiscountService } from './services';
import { CustomerTypeController, DiscountController } from './controllers';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerType, Preference, Discount])],
  controllers: [CustomerTypeController, DiscountController],
  providers: [CustomerTypeService, DiscountService],
  exports: [TypeOrmModule, CustomerTypeService, DiscountService],
})
export class AdministrationModule {}
