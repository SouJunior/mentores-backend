import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const LoggedUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userObject = request.user;

  delete userObject.password;
  delete userObject.code;
  delete userObject.emailConfirmed;
  delete userObject.deleted;
  delete userObject.accessAttempt;

  if (userObject) {
    return userObject;
  }

  throw new UnauthorizedException(
    'User does not have permission to access this route',
  );
});
