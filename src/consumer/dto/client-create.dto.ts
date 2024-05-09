import {
  ArrayMaxSize,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateClientDto {
  @IsString()
  @IsNotEmpty()
  firstname: string;

  @IsString()
  @IsNotEmpty()
  lastname: number;

  @IsString()
  middlename: string;

  @IsNumber()
  dni: number;

  @IsNumber()
  phone: number;

  @IsMongoId({ each: true })
  @ArrayMaxSize(3)
  actions: string[];
}
