import { IsDateString, IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateReadingDto {
  @IsMongoId()
  action: string;

  @IsNumber()
  @Min(0)
  consume: number;

  @IsDateString()
  consumptionDate: string;
}
