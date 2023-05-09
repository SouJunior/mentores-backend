import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../user/entity/user.entity';
import { EmailTemplateType } from './types/email-template.type';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailConfirmation(user: UserEntity): Promise<void> {
    const { email, fullName, code } = user;
    const url = `http://localhost:3333/recoveryPassword?token=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Recuperação de Senha!',
      template: './send',
      context: {
        name: fullName,
        url,
      },
    });

    return;
  }

  async sendCreationConfirmation(user: UserEntity) {
    const { email, fullName, code } = user;

    const url = `http://localhost:3333/emailConfirmation?token=${code}`;

    await this.mailerService.sendMail({
      to: email,
      subject: 'Usuário criado!',
      template: './create',
      context: {
        name: fullName,
        url,
      },
    });

    return;
  }

  async sendMail({ subject, template, context, email }: EmailTemplateType) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context,
    });

    return;
  }
}
