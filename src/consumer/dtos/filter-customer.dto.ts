import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { CustomerStatus } from '../entities';

export class FilterCustomerDto {
  @IsString()
  @IsOptional()
  fullname?: string;

  @IsString()
  @IsOptional()
  meterNumber?: string;

  @IsString()
  @IsOptional()
  dni?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  type?: number;

  @IsEnum(CustomerStatus)
  @IsOptional()
  status: CustomerStatus;

}
