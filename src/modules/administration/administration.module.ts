import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerType, Discount, Preference } from './entities';
import { CustomerTypeService } from './services';
import { CustomerTypeController } from './controllers/customer-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerType, Preference, Discount])],
  controllers: [CustomerTypeController],
  providers: [CustomerTypeService],
  exports: [TypeOrmModule, CustomerTypeService],
})
export class AdministrationModule {}
