import { IsNumber, IsPositive } from 'class-validator';

export class CreateReadingDto {
  @IsNumber()
  @IsPositive()
  customerId: number;

  @IsNumber()
  reading: number;
}
