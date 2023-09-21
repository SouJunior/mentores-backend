import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
     this.userInfoConfirm(user);
    
    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (!passwordIsValid) {
      await this.invalidPassword(user);
    }
    
    user.accessAttempt = 0;
    await this.userRepository.updateUser(user.id, user);

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

      const message = "invalid e-mail or password"
      throw new HttpException({ message }, HttpStatus.NOT_FOUND)

    }

    if (!user.emailConfirmed) {

      const message = 'Your account is not activated yet. Check your e-mail inbox for instructions'
      throw new HttpException({ message }, HttpStatus.NOT_FOUND)

    }

    return;
  }

  async invalidPassword(user: UserEntity) {
    const accessAttempt = user.accessAttempt;

    if (accessAttempt < 5) {
      user.accessAttempt += 1;
      await this.userRepository.updateUser(user.id, user);
    }

    const message =
      accessAttemptMessage[accessAttempt + 1] || 'Invalid e-mail or password';

    throw new HttpException({ message }, HttpStatus.NOT_FOUND)
  }
}
