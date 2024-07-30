import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, IsInt, IsPositive, Min, ValidateNested, IsArray } from 'class-validator';

export class CreateCustomerTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  @Min(1)
  maxDelayMonths: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  minimumPrice:number

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PreferenceDto)
  preferences: PreferenceDto[];
}

export class UpdateCustomerTypeDto extends PartialType(CreateCustomerTypeDto) {}

export class PreferenceDto {
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minUnits: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  maxUnits: number;

  @Type(() => Number)
  @IsInt()
  @IsPositive()
  priceByUnit: number;
}
