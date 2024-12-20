/* eslint-disable prettier/prettier */
import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable, Logger } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeactivateLoggedMentorService {
  // TESTING THRESHOLDS (in minutes)
  private readonly logger = new Logger(DeactivateLoggedMentorService.name);
  private readonly SECOND_NOTICE_DAYS = 15;
  private readonly THIRD_NOTICE_DAYS = 28;

  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  async execute(mentor: MentorEntity): Promise<{ message: string }> {
    try {
      const mentorExists = await this.mentorRepository.findMentorById(
        mentor.id,
      );

      if (!mentorExists) {
        throw new Error('Mentor not found');
      }

      // Set deleted status and deactivation date
      await this.mentorRepository.deactivateMentorById(mentor.id);

      try {
        // Send first notification immediately
        await this.mailService.mentorSendFirstDeactivationNotice(mentor);
        this.logger.log(
          `Primeira notificação enviada com sucesso para mentor ${mentor.id}`,
        );
      } catch (emailError) {
        this.logger.error(
          `Falha ao enviar a primeira notificação para mentor ${mentor.id}:`,
          emailError,
        );
      }

      return { message: 'Account deactivated successfully' };
    } catch (error) {
      this.logger.error(
        `Falha ao executar desativação para mentor ${mentor.id}`,
        error,
      );
      throw error;
    }
  }

  // Usa o cron para verificar todo dia à meia noite se há alterações nos mentores desativados.
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async handleDeactivationNotifications() {
    try {
      const now = new Date();
      this.logger.log(
        `Verificacao diária de notificação iniciada: ${this.formatDateTime(
          now,
        )}`,
      );

      const deactivatedMentors =
        await this.mentorRepository.findDeactivatedMentors();

      for (const mentor of deactivatedMentors) {
        const daysSinceDeactivation = this.getDaysSinceDeactivation(
          new Date(mentor.updatedAt),
        );

        this.logger.log(
          `Mentor ${mentor.id} - Dias desde desativação: ${daysSinceDeactivation}`,
        );

        await this.processNotification(mentor, daysSinceDeactivation);
      }
    } catch (error) {
      this.logger.error(
        `Erro no processo de notificação de desativacao: `,
        error,
      );
    }
  }

  private async processNotification(
    mentor: MentorEntity,
    daysSince: number,
  ): Promise<void> {
    try {
      // Verifica se está exatamente no dia 15 (com margem de 1 dia para garantir envio da notificacao)
      if (
        daysSince >= this.SECOND_NOTICE_DAYS &&
        daysSince < this.SECOND_NOTICE_DAYS + 1
      ) {
        this.logger.log(
          `Enviando segunda notificação para mentor ${mentor.id}`,
        );
        await this.mailService.mentorSendSecondDeactivationNotice(mentor);
      }

      // Verifica se está exatamente no dia 28 (com marge de 1 dia para garantir envio da notificacao)
      if (
        daysSince >= this.THIRD_NOTICE_DAYS &&
        daysSince < this.THIRD_NOTICE_DAYS + 1
      ) {
        this.logger.log(
          `Enviando terceira notificação para mentor ${mentor.id}`,
        );
        await this.mailService.mentorSendThirdDeactivationNotice(mentor);
      }
    } catch (error) {
      this.logger.error(
        `Erro ao processar notificações para mentor ${mentor.id}`,
        error,
      );
    }
  }

  // cria propriedade para pegar os dias desde a desativação da conta
  private getDaysSinceDeactivation(deactivationDate: Date): number {
    // agora
    const now = new Date();
    const diffTime = now.getTime() - deactivationDate.getTime();
    // retorna a quantidade de dias
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
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
