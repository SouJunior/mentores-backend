import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { handleError } from '../../shared/utils/handle-error.util';
import { UserEntity } from '../user/entity/user.entity';
import { EmailTemplateType } from './types/email-template.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(user: UserEntity): Promise<void> {
    const { email, fullName, code } = user;
    const url = `${process.env.URL_CONFIRM_EMAIL}code=${code}&email=${email}`;

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

  async sendCreationConfirmation(user: UserEntity) {
    const { email, fullName, code } = user;
    const { URL_CONFIRM_EMAIL } = process.env;

    const url = `${URL_CONFIRM_EMAIL}code=${code}&email=${email}`;

    try {
      console.log("antes de enviar o e-mail")
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
        console.log("depois de enviar o e-mail")
    } catch (error) {
      console.log(error.message);
    }

    return;
  }

  async sendRestorationEmail(userData: UserEntity) {
    const { email, code } = userData;
    const { URL_RESTORATION_EMAIL } = process.env;

    const url = `${URL_RESTORATION_EMAIL}code=${code}&email=${email}`;

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
