import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MentorRepository } from '../../mentors/repository/mentor.repository';
import { InfoLoginDto } from '../dtos/info-login.dto';
import { accessAttemptMessage } from '../enums/message.enum';
import { UserRepository } from '../../user/user.repository';
import { InfoEntity } from '../entity/info.entity';

@Injectable()
export class AuthService {
  constructor(
    private mentorRepository: MentorRepository,
    private userRepository: UserRepository,
    private jwt: JwtService,
  ) {}

  async execute({ email, password, type }: InfoLoginDto) {
    let info: InfoEntity;
    if (type === 'mentor') {
      info = await this.mentorRepository.findMentorByEmail(email);
    } else {
      info = await this.userRepository.findUserByEmail(email);
    }
    this.infoConfirm(info);

    const passwordIsValid = await bcrypt.compare(password, info.password);

    if (!passwordIsValid) {
      await this.invalidPassword(info, type);
    }

    info.accessAttempt = 0;
    if (type === 'mentor') {
      await this.mentorRepository.updateMentor(info.id, info);
    } else {
      await this.userRepository.updateUser(info.id, info);
    }

    delete info.password;
    delete info.code;
    delete info.emailConfirmed;
    delete info.deleted;
    delete info.accessAttempt;

    return {
      status: 200,
      data: {
        token: this.jwt.sign({ email }),
        info,
      },
    };
  }

  infoConfirm(info: InfoEntity) {
    if (!info || info.deleted == true) {
      const message = 'invalid e-mail or password';
      throw new HttpException({ message }, HttpStatus.NOT_FOUND);
    }

    if (!info.emailConfirmed) {
      const message =
        'Your account is not activated yet. Check your e-mail inbox for instructions';
      throw new HttpException({ message }, HttpStatus.NOT_FOUND);
    }

    return;
  }

  async invalidPassword(info: InfoEntity, type) {
    const accessAttempt = info.accessAttempt;

    if (accessAttempt < 5) {
      info.accessAttempt += 1;
      if (type === 'mentor') {
        await this.mentorRepository.updateMentor(info.id, info);
      } else {
        await this.userRepository.updateUser(info.id, info);
      }
    }

    const message =
      accessAttemptMessage[accessAttempt + 1] || 'Invalid e-mail or password';

    throw new HttpException({ message }, HttpStatus.NOT_FOUND);
  }
}
