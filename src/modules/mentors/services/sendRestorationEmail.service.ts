import { GenerateCodeUtil } from '../../../shared/utils/generate-code.util';
import { MailService } from '../../mails/mail.service';
import { ActivateMentorDto } from '../dtos/activate-mentor.dto';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SendRestorationEmailService {
  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
    private generateCodeUtil: GenerateCodeUtil,
  ) {}

  async execute(email: string): Promise<{
    message: string;
    userData?: ActivateMentorDto;
  }> {
    const mentorExists = await this.mentorRepository.findMentorByEmail(email);

    if (!mentorExists) {
      return {
        message: 'Mentor not found',
      };
    }

    mentorExists.code = this.generateCodeUtil.create();

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    await this.mailService.mentorSendRestorationEmail(mentorExists);

    return {
      message: 'E-mail de recuperação enviado',
      userData: { code: mentorExists.code, email: mentorExists.email },
    };
  }
}
