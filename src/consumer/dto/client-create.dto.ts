import { IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  middlename: string;

  @IsString()
  lastname: string;

  @IsString()
  @IsNotEmpty()
  dni: string;

  @IsString()
  phone: string;

  @IsString()
  @IsNotEmpty()
  address: string;
}
