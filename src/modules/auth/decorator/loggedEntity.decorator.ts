import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

export const LoggedEntity = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const userObject = request.user;
  const mentorObject = request.mentor;
  let entityObject;

  if (userObject) {
    entityObject = userObject;
  }

  if (mentorObject) {
    entityObject = mentorObject;
  }

  delete entityObject.password;
  delete entityObject.code;
  delete entityObject.emailConfirmed;
  delete entityObject.deleted;
  delete entityObject.accessAttempt;

  if (entityObject) {
    return entityObject;
  }

  throw new UnauthorizedException(
    'User does not have permission to access this route',
  );
});
