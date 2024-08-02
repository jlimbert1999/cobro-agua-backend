import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-account.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
