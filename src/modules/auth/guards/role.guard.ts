import { Injectable, CanActivate, ExecutionContext, InternalServerErrorException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Roles } from '../decorators';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride(Roles, [context.getHandler(), context.getClass()]);
    if (!roles) return true;
    const request = context.switchToHttp().getRequest();
    const user: User = request['user'];
    if (!user) throw new InternalServerErrorException('user not found in request');
    return roles.every((role) => user.roles.includes(role));
  }
}
