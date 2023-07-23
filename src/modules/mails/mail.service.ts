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

    return;
  }

  async sendMail({ subject, template, context, email }: EmailTemplateType) {
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
