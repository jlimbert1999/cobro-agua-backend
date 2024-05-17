import { applyDecorators, UseGuards } from '@nestjs/common';
import { UserRole } from 'src/users/schemas/user.schema';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from './roles.decorator';

export const META_ROLE = 'roles';
export function Protected(...roles: UserRole[]) {
  return applyDecorators(Roles(roles), UseGuards(RoleGuard));
}
