import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateActionDto {
  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  code: string;

  @IsNumber()
  cost: number;
}
