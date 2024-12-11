import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { handleError } from '../../shared/utils/handle-error.util';
import { EmailTemplateType } from './types/email-template.type';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { UserEntity } from '../user/entities/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async mentorSendEmailConfirmation(mentor: MentorEntity): Promise<void> {
    const { email, fullName, code } = mentor;
    const url = `${process.env.URL_CONFIRM_EMAIL}?code=${code}&email=${email}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Recuperação de Senha!',
        template: './send',
        context: {
          name: fullName,
          url,
        },
      })
      .catch(handleError);

    return;
  }

  async mentorSendCreationConfirmation(mentor: MentorEntity) {
    const { email, fullName, code } = mentor;
    const { URL_CONFIRM_EMAIL } = process.env;

    const url = `${URL_CONFIRM_EMAIL}?code=${code}&email=${email}`;

    console.log(this.mailerService);
    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Confirme sua conta - SouJunior!',
          template: './confirmEmail',
          context: {
            name: fullName,
            url,
            email,
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async mentorSendRestorationEmail(mentorData: MentorEntity) {
    const { email, code } = mentorData;
    const { URL_RESTORATION_EMAIL } = process.env;

    const url = `${URL_RESTORATION_EMAIL}?code=${code}&email=${email}`;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Recuperação de conta - SouJunior!',
          template: './restoreEmail',
          context: {
            url,
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  /**
   * Criar método que envie uma notificação via email informando que a conta será desativada em 30 dias.
   * @input mentor: MentorEntity
   * @processamento
   ** tenta chamar o método this.mailerService.sendMail passando os dados desestruturados do mentor.
   * @output
   ** email enviado para o mentor || catch (error) console.log(error.message)
   */

  async mentorSendAccountDeletionNotice(mentor: MentorEntity): Promise<void> {
    // Desestruturar mentor
    const { email, fullName } = mentor;

    // url para logar e reativar a conta
    const loginUrl = process.env.LOGIN_URL;
    // TODO: SOLICITAR A URL PARA LOGIN

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Conta em processo de exclusão - SouJunior',
        template: './firstAccountDeletionReminder',
        context: {
          name: fullName,
          loginUrl,
          // Para testar, irei deixar a hora de exclusão daqui a 1 hora.
          deletionDate: new Date(
            Date.now() + 1 * 60 * 1000, // 1 minuto (para fins de testes)
          ).toLocaleDateString('pt-BR'),
        },
      });
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async userSendEmailConfirmation(user: UserEntity): Promise<void> {
    const { email, fullName, code } = user;
    const url = `${process.env.URL_CONFIRM_EMAIL}?code=${code}&email=${email}`;

    await this.mailerService
      .sendMail({
        to: email,
        subject: 'Recuperação de Senha!',
        template: './send',
        context: {
          name: fullName,
          url,
        },
      })
      .catch(handleError);

    return;
  }

  async userSendCreationConfirmation(user: UserEntity) {
    const { email, fullName, code } = user;
    const { URL_CONFIRM_EMAIL } = process.env;

    const url = `${URL_CONFIRM_EMAIL}?code=${code}&email=${email}`;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Confirme sua conta - SouJunior!',
          template: './confirmEmail',
          context: {
            name: fullName,
            url,
            email,
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async userSendRestorationEmail(userData: UserEntity) {
    const { email, code } = userData;
    const { URL_RESTORATION_EMAIL } = process.env;

    const url = `${URL_RESTORATION_EMAIL}?code=${code}&email=${email}`;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Recuperação de conta - SouJunior!',
          template: './restoreEmail',
          context: {
            url,
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async sendEmail({ subject, template, context, email }: EmailTemplateType) {
    return; // remover depois que for resolvido
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context,
    });

    return;
  }
}
