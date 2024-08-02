import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  fullname: string;

  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  password: string;

  @IsEnum(UserRole, { each: true })
  @IsOptional()
  roles?: UserRole[];
}
