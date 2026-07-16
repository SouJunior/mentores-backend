import { MailService } from 'src/modules/mails/mail.service';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable, Logger } from '@nestjs/common';
import { MentorEntity } from '../entities/mentor.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class DeleteMentorService {
  private readonly logger = new Logger(DeleteMentorService.name);
  private readonly SECOND_NOTICE_DAYS = 15;
  private readonly THIRD_NOTICE_DAYS = 28;

  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  async execute(mentor: MentorEntity): Promise<{ message: string }> {
    const mentorExists = await this.mentorRepository.findMentorById(mentor.id);
    if (!mentorExists) {
      throw new Error('Mentor not found');
    }

    await this.mentorRepository.deactivateMentorById(mentor.id);
    await this.mentorRepository.updateMentor(mentor.id, { deactivatedDays: 0 });
    
    await this.mailService.mentorSendFirstDeactivationNotice(mentor);
    this.logger.log(`Primeira notificação enviada para mentor ${mentor.id}`);

    return { message: 'Account deactivated successfully' };
  }

  @Cron(CronExpression.EVERY_DAY_AT_1AM)
  async handleDeactivationNotifications() {
    this.logger.log('Iniciando verificação de notificações de desativação...');

    await this.sendNoticeFor(this.SECOND_NOTICE_DAYS);
    await this.sendNoticeFor(this.THIRD_NOTICE_DAYS);

    this.logger.log('Verificação de notificações concluída.');
  }

  private async sendNoticeFor(days: number): Promise<void> {
    const noticeType = days === this.SECOND_NOTICE_DAYS ? 'segunda' : 'terceira';
    this.logger.log(`Buscando mentores para ${noticeType} notificação (${days} dias).`);

    const mentorsToNotify = await this.mentorRepository.findMentorsDeactivatedFor(days);

    if (mentorsToNotify.length === 0) {
      this.logger.log(`Nenhum mentor encontrado para a ${noticeType} notificação.`);
      return;
    }

    this.logger.log(`${mentorsToNotify.length} mentor(es) encontrado(s).`);

    for (const mentor of mentorsToNotify) {
      try {
        if (days === this.SECOND_NOTICE_DAYS) {
          await this.mailService.mentorSendSecondDeactivationNotice(mentor);
        } else if (days === this.THIRD_NOTICE_DAYS) {
          await this.mailService.mentorSendThirdDeactivationNotice(mentor);
        }
        
        await this.mentorRepository.updateMentor(mentor.id, { deactivatedDays: days });
        this.logger.log(`${noticeType.charAt(0).toUpperCase() + noticeType.slice(1)} notificação enviada para mentor ${mentor.id}`);
      } catch (error) {
        this.logger.error(`Falha ao enviar ${noticeType} notificação para mentor ${mentor.id}:`, error);
      }
    }
  }
}