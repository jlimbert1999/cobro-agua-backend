import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateDiscountDto {
  @IsNumber()
  @Min(1)
  @Max(100)
  percentage: number;

  @IsString()
  @IsNotEmpty()
  name: string;
}
export class UpdateDiscountDto extends PartialType(CreateDiscountDto) {}
