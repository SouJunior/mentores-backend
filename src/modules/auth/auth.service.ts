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
        data: { message: 'E-mail ou senha inválidos' },
      };
    }

    if (user.accessAttempt === 5) {
      return {
        status: 400,
        data: {
          message:
            "Seu acesso à conta continua bloqueado, pois você não redefiniu sua senha após as cinco tentativas de acesso incorretas. Por favor, clique em 'Esqueci minha senha' para realizar a recuperação.",
        },
      };
    }

    const passwordIsValid = await bcrypt.compare(password, user.password);

    if (user.accessAttempt === 3) {
      user.accessAttempt += 1;
      await this.userRepository.updateAccessAttempts(user);
      return {
        status: 400,
        data: {
          message:
            "Você digitou a senha incorretamente e será bloqueado após cinco tentativas. Para cadastrar um nova senha clique 'Esqueci minha senha'",
        },
      };
    }

    if (user.accessAttempt === 4) {
      user.accessAttempt += 1;
      await this.userRepository.updateAccessAttempts(user);
      return {
        status: 400,
        data: {
          message:
            "Por questões de segurança, bloqueamos sua conta após você ter atingido a quantidade máxima de tentativas de acesso. Para cadastrar uma nova senha, clique em 'Esqueci minha senha'.",
        },
      };
    }

    if (!passwordIsValid) {
      user.accessAttempt += 1;
      await this.userRepository.updateAccessAttempts(user);
      return {
        status: 400,
        data: { message: 'E-mail ou senha inválidos' },
      };
    }

    user.accessAttempt = 0;
    await this.userRepository.updateAccessAttempts(user);

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
