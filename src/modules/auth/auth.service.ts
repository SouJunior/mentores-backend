import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../user/repository/user.repository';
import { UserLoginDto } from './dtos/user-login.dto';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async execute({ email, password }: UserLoginDto) {
    const user = await this.userRepository.findUserByEmail(email);

    if (!user?.emailConfirmed || !user || user.deleted === true) {
      return {
        status: 400,
        data: { message: 'Invalid e-mail or password' },
      };
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      user.accessAttempt += 1;
      await this.userRepository.updateUser(user);

    if (user.accessAttempt === 5) {
      return {
        status: 400,
        data: {
          message:
            "Your account access is still blocked, because you dont redefined your password after five incorrect tries, please, click on 'Forgot my password' to begin the account restoration.",
        },
      };
    }

    if (user.accessAttempt === 3) {
      user.accessAttempt += 1;
      await this.userRepository.updateUser(user);
      return {
        status: 400,
        data: {
          message:
            "You typed the password incorrectly and will be blocked in five tries. To register a new password click on 'Forgot my password'",
        },
      };
    }

    if (user.accessAttempt === 4) {
      user.accessAttempt += 1;
      await this.userRepository.updateUser(user);
      return {
        status: 400,
        data: {
          message:
            "For security reasons, we blocked your account after you exceeded the maximum amount of access tries. To register a new password click on 'Forgot my password'",
        },
      };
    }
    return {
      status: 400,
      data: { message: 'Invalid e-mail or password' },
    };
    }

    user.accessAttempt = 0;
    await this.userRepository.updateUser(user);

    delete user.password;
    delete user.code;
    delete user.emailConfirmed;
    delete user.deleted;
    delete user.accessAttempt;

    return {
      status: 200,
      data: {
        token: this.jwt.sign({ email }),
        user,
      },
    };
  }
}
