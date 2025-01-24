/**
 * Serviço responsável por gerenciar a desativação de mentores e o envio de notificações.
 * Implementa um sistema automatizado que envia três níveis de notificações em diferentes
 * períodos após a desativação inicial da conta.
 *
 * Principais funcionalidades:
 * - Desativação da conta do mentor
 * - Envio automático de notificações em intervalos específicos
 * - Monitoramento e registro de todas as operações
 */

/* eslint-disable prettier/prettier */
import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable, Logger } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeactivateLoggedMentorService {
  /**
   * Logger para registro de operações e erros do serviço
   * @private
   */
  private readonly logger = new Logger(DeactivateLoggedMentorService.name);

  /**
   * Número de dias após a desativação para enviar a segunda notificação
   * @private
   */
  private readonly SECOND_NOTICE_DAYS = 15;

  /**
   * Número de dias após a desativação para enviar a terceira notificação
   * @private
   */
  private readonly THIRD_NOTICE_DAYS = 28;

  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  /**
   * Executa o processo de desativação da conta do mentor.
   *
   * @param mentor - Entidade do mentor a ser desativado
   * @returns Objeto contendo mensagem de confirmação da desativação
   * @throws Error quando o mentor não é encontrado ou ocorre falha no processo
   */
  async execute(mentor: MentorEntity): Promise<{ message: string }> {
    try {
      const mentorExists = await this.mentorRepository.findMentorById(
        mentor.id,
      );

      if (!mentorExists) {
        throw new Error('Mentor not found');
      }

      // Define o status como desativado e registra a data
      await this.mentorRepository.deactivateMentorById(mentor.id);

      try {
        // Envia primeira notificação imediatamente após desativação
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

  /**
   * Método agendado que executa diariamente à meia-noite.
   * Verifica e processa o envio de notificações para mentores desativados
   * com base no tempo decorrido desde a desativação.
   */
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

  /**
   * Processa o envio de notificações com base no número de dias desde a desativação.
   * Implementa uma margem de 1 dia para garantir o envio das notificações.
   *
   * @param mentor - Entidade do mentor para envio da notificação
   * @param daysSince - Número de dias desde a desativação da conta
   */
  private async processNotification(
    mentor: MentorEntity,
    daysSince: number,
  ): Promise<void> {
    try {
      // Verifica período para segunda notificação (15 dias)
      if (
        daysSince >= this.SECOND_NOTICE_DAYS &&
        daysSince < this.SECOND_NOTICE_DAYS + 1
      ) {
        this.logger.log(
          `Enviando segunda notificação para mentor ${mentor.id}`,
        );
        await this.mailService.mentorSendSecondDeactivationNotice(mentor);
      }

      // Verifica período para terceira notificação (28 dias)
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

  /**
   * Calcula o número de dias decorridos desde a data de desativação.
   *
   * @param deactivationDate - Data em que a conta foi desativada
   * @returns Número de dias desde a desativação
   */
  private getDaysSinceDeactivation(deactivationDate: Date): number {
    const now = new Date();
    const diffTime = now.getTime() - deactivationDate.getTime();
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Formata data e hora no padrão brasileiro.
   *
   * @param date - Data a ser formatada
   * @returns String no formato dd/mm/yy HH:mm:ss
   */
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
