import { IsNumber } from 'class-validator';

export class ConfigDto {
  @IsNumber()
  pricePerUnit: number;

  @IsNumber()
  maxUnits: number;

  @IsNumber()
  pricePerExcessUnit: number;

  @IsNumber()
  maxDelayMonths: number;
}
