import {
  CanActivate,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { META_RESOURCE } from '../decorators';
import { User } from '../schemas/user.schema';

@Injectable()
export class ResourceGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const validResource: string | undefined = this.reflector.get(
      META_RESOURCE,
      context.getClass(),
    );
    if (!validResource) return true;
    const req = context.switchToHttp().getRequest();
    const account = req.user as User;
    if (!account)
      throw new InternalServerErrorException(
        'ResourceGuard auth problems or not call, no user in request',
      );

    return true
  }
}
