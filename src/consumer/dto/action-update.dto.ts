import { PartialType } from '@nestjs/mapped-types';
import { CreateActionDto } from './action-create.dto';

export class UpdateActionDto extends PartialType(CreateActionDto) {}
