import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { MentorRepository } from '../repository/mentor.repository';
import { MailService } from '../../mails/mail.service';

@Injectable()
export class ResendConfirmationEmailService {
  constructor(
    private readonly mentorRepository: MentorRepository,
    private readonly mailService: MailService,
  ) {}

  async execute(email: string) {
    const mentor = await this.mentorRepository.findMentorByEmail(email);

    if (!mentor) {
      throw new HttpException('Mentor não encontrado', HttpStatus.NOT_FOUND);
    }
    if (mentor.emailConfirmed) {
      throw new HttpException(
        'Este e-mail já foi confirmado',
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.mailService.mentorSendCreationConfirmation(mentor);

    return { message: 'Email de confirmação reenviado com sucesso!' };
  }
}
