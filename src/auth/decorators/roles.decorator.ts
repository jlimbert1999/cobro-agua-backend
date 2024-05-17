import { Reflector } from '@nestjs/core';
import { UserRole } from 'src/users/schemas/user.schema';

export const Roles = Reflector.createDecorator<UserRole[]>();
