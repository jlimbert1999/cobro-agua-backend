import { PartialType } from '@nestjs/mapped-types';
import { CreateClientDto } from './client-create.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {}
