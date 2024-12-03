import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DesactivateLoggedMentorService {
  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    await this.mentorRepository.deactivateMentorById(id);

    return { message: 'Mentor deactivated successfully' };
  }
}
