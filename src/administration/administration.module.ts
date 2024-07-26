import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerType, Preference } from './entities';
import { CustomerTypeService } from './services';
import { CustomerTypeController } from './controllers/customer-type.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerType, Preference])],
  controllers: [CustomerTypeController],
  providers: [CustomerTypeService],
  exports: [TypeOrmModule],
})
export class AdministrationModule {}
