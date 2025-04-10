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

  async mentorSendFirstDeactivationNotice(mentor: MentorEntity): Promise<void> {
    const { email, fullName } = mentor;

    const loginUrl = process.env.LOGIN_URL;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Conta em processo de exclusão - SouJunior',
          template: './firstDeactivationNotification',
          context: {
            name: fullName,
            loginUrl,
            deletionDate: new Date(
              Date.now() + 1 * 60 * 1000,
            ).toLocaleDateString('pt-BR'),
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async mentorSendSecondDeactivationNotice(mentor: MentorEntity) {
    const { email, fullName } = mentor;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Lembrete de desativação de conta - SouJunior',
          template: './secondDeactivationNotification',
          context: {
            name: fullName,
          },
        })
        .catch(handleError);
    } catch (error) {
      console.log(error.message);
    }
    return;
  }

  async mentorSendThirdDeactivationNotice(mentor: MentorEntity) {
    const { email, fullName } = mentor;

    try {
      await this.mailerService
        .sendMail({
          to: email,
          subject: 'Sua conta será permanentemente desativada - SouJunior',
          template: './thirdDeactivationNotification',
          context: {
            name: fullName,
          },
        })
        .catch(handleError);
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
