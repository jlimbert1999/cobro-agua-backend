import { IsMongoId, IsNumber } from 'class-validator';

export class CreateReadingDto {
  @IsMongoId()
  client: string;

  @IsNumber()
  reading: number;
}
