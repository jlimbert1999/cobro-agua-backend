import {
  ExecutionContext,
  InternalServerErrorException,
  createParamDecorator,
} from '@nestjs/common';
import { User } from '../schemas/user.schema';

// extract user nested by strategy method in request
export const GetUserRequest = createParamDecorator(
  (propertyPath: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const user = req.user as User;
    if (!user)
      throw new InternalServerErrorException('User not found (request)');
    return !propertyPath ? user : user[propertyPath];
  },
);
