import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: keyof any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest(); // Get the request object from the execution context
    const user = request.user; // Access the user object attached by the authentication guard
    return data ? user?.[data] : user;
  },
);
