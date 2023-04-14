import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { UserRepository } from '../repository/user.repository';

@ValidatorConstraint({ async: true })
export class IsEmailNotRegistered implements ValidatorConstraintInterface {
  constructor(private userRepository: UserRepository) {}

  async validate(email: any) {
    const user = await this.userRepository.findUserByEmail(email);
    return user === undefined;
  }
}

export function EmailNotRegistered(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotRegistered,
    });
  };
}
