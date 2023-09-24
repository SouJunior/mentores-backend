import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mails/mail.service';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository,
  private generateCodeUtil: GenerateCodeUtil,
  private mailService: MailService,) {}

  async create(data: CreateUserDto) {
    data.dateOfBirth = new Date(data.dateOfBirth);

    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);
    data.code = this.generateCodeUtil.create();

    delete data.passwordConfirmation;
    delete data.emailConfirm;

    const newUser = await this.userRepository.createNewUser(data);

    await this.mailService.userSendCreationConfirmation(newUser);

    return { message: 'User created successfully' };;
  }
}
