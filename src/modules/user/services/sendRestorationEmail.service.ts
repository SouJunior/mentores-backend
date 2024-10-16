import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';
import { MailService } from '../../mails/mail.service';
import { ActivateUserDto } from '../dto/activate-user.dto';

@Injectable()
export class SendRestorationEmailService {
  constructor(
    private userRepository: UserRepository,
    private generateCodeUtil: GenerateCodeUtil,
    private mailService: MailService,
  ) {}

  async execute(email: string): Promise<{
    message: string;
    userData?: ActivateUserDto;
  }> {
    const UserExists = await this.userRepository.findUserByEmail(email);

    if (!UserExists) {
      return {
        message: 'User not found',
      };
    }

    UserExists.code = this.generateCodeUtil.create();

    await this.userRepository.updateUser(UserExists.id, UserExists);

    await this.mailService.userSendRestorationEmail(UserExists);

    return {
      message: 'E-mail de recuperação enviado',
      userData: { code: UserExists.code, email: UserExists.email },
    };
  }
}
