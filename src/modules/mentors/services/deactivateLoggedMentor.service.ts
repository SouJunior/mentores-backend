import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

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

    // Set deleted status and deactivation date
    await this.mentorRepository.deactivateMentorById(mentor.id);

    // Send first notification immediately
    await this.mailService.mentorSendFirstDeactivationNotice(mentor);

    return { message: 'Account deactivated successfully' };
  }

  // Usa o cron para verificar todo dia à meia noite se há alterações nos mentores desativados.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeactivationNotifications() {
    // Pega lista de mentores desativados
    const deactivatedMentors =
      await this.mentorRepository.findDeactivatedMentors();

    for (const mentor of deactivatedMentors) {
      const daysSinceDeactivation = this.getDaysSinceDeactivation(
        new Date(mentor.updatedAt),
      );

      if (daysSinceDeactivation === 15) {
        await this.mailService.mentorSendSecondDeactivationNotice(mentor);
      }

      if (daysSinceDeactivation === 28) {
        await this.mailService.mentorSendThirdDeactivationNotice(mentor);
      }
    }
  }
  // cria propriedade para pegar os dias desde a desativação da conta
  private getDaysSinceDeactivation(deactivationDate: Date): number {
    // agora
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deactivationDate.getTime());
    return Math.ceil((diffTime / 1000) * 60 * 60 * 24);
  }
}
