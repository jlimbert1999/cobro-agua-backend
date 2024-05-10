import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: number;

  @IsString()
  middlename: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsNumber()
  phone: number;

  @IsString()
  @IsNotEmpty()
  address: string;
}
