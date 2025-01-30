import { IsNumber, Max, Min } from 'class-validator';

export class CreateDiscountDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage: number;
}
