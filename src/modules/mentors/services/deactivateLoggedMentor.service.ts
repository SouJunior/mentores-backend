import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeactivateLoggedMentorService {
  // TESTING THRESHOLDS (in minutes)
  private readonly SECOND_NOTICE_MINUTES = 2;
  private readonly THIRD_NOTICE_MINUTES = 4;

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
  // TODO: MUDAR PARA TODO DIA MEIA NOITE
  @Cron(CronExpression.EVERY_MINUTE)
  async handleDeactivationNotifications() {
    const now = new Date();
    console.log(`Cron está rodando, horario: ${this.formatDateTime(now)}`);

    // Pega lista de mentores desativados
    const deactivatedMentors =
      await this.mentorRepository.findDeactivatedMentors();

    for (const mentor of deactivatedMentors) {
      // const daysSinceDeactivation = this.getDaysSinceDeactivation(
      //   new Date(mentor.updatedAt),
      // );

      const minutesSinceDeactivation = this.getMinutesSinceDeactivation(
        new Date(mentor.updatedAt),
      );

      console.log(
        `minutes since deactivation for mentor ${mentor.id}: ${minutesSinceDeactivation}`,
      );

      // TODO: MUDAR PARA 15 DIAS
      if (minutesSinceDeactivation >= 2 && minutesSinceDeactivation < 3) {
        await this.mailService.mentorSendSecondDeactivationNotice(mentor);
      }

      // TODO: MUDAR PARA 28 DIAS
      if (minutesSinceDeactivation >= 4 && minutesSinceDeactivation < 5) {
        await this.mailService.mentorSendThirdDeactivationNotice(mentor);
      }
    }
  }

  // eslint-disable-next-line prettier/prettier
  private async processNotification(
    mentor: MentorEntity,
    minutesSince: number,
  ): Promise<void> {
    // send second notice at 2 minutes
    // eslint-disable-next-line prettier/prettier
    if (
      minutesSince >= this.SECOND_NOTICE_MINUTES &&
      minutesSince < this.SECOND_NOTICE_MINUTES
    ) {
      console.log(`Enviando segunda notificação para mentor ${mentor.id}`);
      await this.mailService.mentorSendSecondDeactivationNotice(mentor);
    }

    if (
      minutesSince >= this.THIRD_NOTICE_MINUTES &&
      minutesSince < this.THIRD_NOTICE_MINUTES
    ) {
      console.log(`Enviando terceira notificação para mentor ${mentor.id}`);
      await this.mailService.mentorSendThirdDeactivationNotice(mentor);
    }
  }

  // cria propriedade para pegar os dias desde a desativação da conta
  private getDaysSinceDeactivation(deactivationDate: Date): number {
    // agora
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - deactivationDate.getTime());
    return Math.ceil((diffTime / 1000) * 60 * 60 * 24);
  }

  private getMinutesSinceDeactivation(deactivationDate: Date): number {
    // agora
    const now = new Date();
    // tempo de diferenca
    const diffTime = Math.abs(now.getTime() - deactivationDate.getTime());
    // retorna o tempo
    return Math.ceil(diffTime / (1000 * 60));
  }

  private formatDateTime(date: Date): string {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  }
}
