import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';

@Injectable()
export class DeactivateLoggedMentorService {
  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  async execute(mentor: MentorEntity): Promise<{ message: string }> {
    const mentorExists = await this.mentorRepository.findMentorById(mentor.id);

    if (!mentorExists) {
      throw new Error('Mentor not found');
    }

    await this.mailService.mentorSendAccountDeletionNotice(mentor);

    await this.mentorRepository.deactivateMentorById(mentor.id);

    return { message: 'Email sent successfully' };
  }
}
