import { applyDecorators, UseGuards } from '@nestjs/common';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from './roles.decorator';
import { UserRole } from 'src/users/entities/user.entity';

export const META_ROLE = 'roles';
export function Protected(...roles: UserRole[]) {
  return applyDecorators(Roles(roles), UseGuards(RoleGuard));
}
