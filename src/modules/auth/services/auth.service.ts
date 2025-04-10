import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { MailService } from '../../../modules/mails/mail.service';
import { MentorRepository } from '../../../modules/mentors/repository/mentor.repository';
import { UserRepository } from '../../../modules/user/user.repository';
import { InfoLoginDto } from '../dtos/info-login.dto';
import { InfoEntity } from '../entity/info.entity';
import { MentorEntity } from '../../../modules/mentors/entities/mentor.entity';
import { UserEntity } from '../../../modules/user/entities/user.entity';
import { accessAttemptMessage } from '../enums/message.enum';

import IHashAdapter from 'src/lib/adapter/hash/hashAdapterInterface';
import { CalendlyRepository } from '../../../modules/calendly/repository/calendly.repository';


@Injectable()
export class AuthService {
  constructor(
    private calendlyRepository: CalendlyRepository,
    private mentorRepository: MentorRepository,
    private userRepository: UserRepository,
    private jwt: JwtService,
    private mailService: MailService,
    @Inject("IHashAdapter") private readonly hashAdapter: IHashAdapter
  ) {}

  async execute({ email, password, type }: InfoLoginDto) {
    let info: InfoEntity;
    if (type === 'mentor') {
      info = await this.mentorRepository.findMentorByEmail(email);
    } else {
      info = await this.userRepository.findUserByEmail(email);
    }
    await this.infoConfirm(info, type);

    // const passwordIsValid = await bcrypt.compare(password, info.password); * Versão antiga
    const passwordIsValid = await this.hashAdapter.compareHash(password, info.password);
    
    if (!passwordIsValid) {
      await this.invalidPassword(info, type);
    }

    info.accessAttempt = 0;
    info.deleted = false
    if (type === 'mentor') {
      await this.mentorRepository.updateMentor(info.id, info);
    } else {
      await this.userRepository.updateUser(info.id, info);
    }

    const calendlyMentorData =
      await this.calendlyRepository.getCalendlyInfoByMentorId(info.id);

    if (!calendlyMentorData) {
      info.calendlyName = '';
    } else {
      info.calendlyName = calendlyMentorData.calendlyName;
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

  async infoConfirm(info: InfoEntity, type: string) {
    if (!info || (info.deleted == true && info.deactivatedDays > 30)) {
      const message = 'invalid e-mail or password';
      throw new HttpException({ message }, HttpStatus.NOT_FOUND);
    }

    if (!info.emailConfirmed) {
      const message =
        'Your account is not activated yet. Check your e-mail inbox for instructions';

      if (type == 'mentor')
        await this.mailService.mentorSendCreationConfirmation(
          info as MentorEntity,
        );
      if (type == 'user')
        await this.mailService.userSendCreationConfirmation(info as UserEntity);

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
