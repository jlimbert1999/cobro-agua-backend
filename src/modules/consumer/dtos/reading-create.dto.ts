import { IsBoolean, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class CreateReadingDto {
  @IsNumber()
  @IsPositive()
  customerId: number;

  @IsNumber()
  reading: number;

  @IsOptional()
  @IsBoolean()
  isNew: boolean;
}
