import { createParamDecorator, ExecutionContext, InternalServerErrorException } from '@nestjs/common';

export const UserRequest = createParamDecorator<string, ExecutionContext>(
  (propertyPath: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request['user'];
    if (!user) throw new InternalServerErrorException('User not found in request');
    return !propertyPath ? user : user[propertyPath];
  },
);
