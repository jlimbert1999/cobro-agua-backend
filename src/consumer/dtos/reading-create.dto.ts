import {  IsNumber, IsUUID } from 'class-validator';

export class CreateReadingDto {
  @IsUUID()
  customerId: string;

  @IsNumber()
  valueReading: number;
}
