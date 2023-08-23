import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

import { UserEntity } from '../user/entity/user.entity';
import { UserRepository } from '../user/repository/user.repository';
import { UserLoginDto } from './dtos/user-login.dto';
import { accessAttemptMessage } from './enum/message.enum';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async execute({ email, password }: UserLoginDto) {
    const user = await this.userRepository.findUserByEmail(email);

    const { data, status } = this.userInfoConfirm(user);
    if (status) return { status, data };

    const passwordIsValid = await bcrypt.compare(password, user.password);
    if (!passwordIsValid) return this.invalidPassword(user);

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

  userInfoConfirm(user: UserEntity) {
    if (!user || user.deleted == true) {
      return {
        status: 400,
        data: { message: 'Invalid e-mail or password' },
      };
    }

    if (!user.emailConfirmed) {
      return {
        status: 400,
        data: {
          message:
            'Your account is not activated yet. Check your e-mail inbox for instructions',
        },
      };
    }

    return { status: 200, data: '' };
  }

  async invalidPassword(user: UserEntity) {
    const accessAttempt = user.accessAttempt;

    if (accessAttempt < 5) {
      user.accessAttempt += 1;
      await this.userRepository.updateUser(user);
    }

    const message =
      accessAttemptMessage[accessAttempt + 1] || 'Invalid e-mail or password';

    return {
      status: 400,
      data: message,
    };
  }
}
