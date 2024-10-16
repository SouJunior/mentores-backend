import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import * as bcrypt from 'bcrypt';
import { ActivateUserDto } from '../dto/activate-user.dto';
import { UserPassConfirmationDto } from '../dto/user-pass-confirmation.dto';

@Injectable()
export class RedefineUserPasswordService {
  constructor(private userRepository: UserRepository) {}

  async execute(
    queryData : ActivateUserDto, passData: UserPassConfirmationDto
  ): Promise<{ message: string }> {
    const userExists = await this.userRepository.findUserByEmail(queryData.email);

    if (!userExists) {
      return {
        message: 'User not found',
      };
    }

    if (userExists.code != queryData.code) {
      return {
        message: 'The code is invalid',
      };
    }

    if (passData.password !== passData.confirmPassword) {
      return {
        message: "The passwords don't match",
      };
    }

    userExists.password = await bcrypt.hash(passData.password, 10);

    userExists.code = null;
    userExists.accessAttempt = 0

    await this.userRepository.updateUser(userExists.id, userExists);

    return {
      message: 'The account was restored sucessfully',
    };
  }
}
