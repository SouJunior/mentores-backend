import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { ActivateUserDto } from '../dto/activate-user.dto';

@Injectable()
export class ActivateUserService {
  constructor(private userRepository: UserRepository,
) {}

  async execute({ code, email }: ActivateUserDto) {
    const userExists = await this.userRepository.findUserByEmail(email);

    if (!userExists || userExists.code != code) {
      return {
        status: 404,
        data: { message: 'User not found' },
      };
    }

    userExists.code = null;
    userExists.emailConfirmed = true;

    await this.userRepository.updateUser(userExists.id, userExists);

    return {
      status: 200,
      data: { message: 'Email confirmed successfully' },
    };
  }
}