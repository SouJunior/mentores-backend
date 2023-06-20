import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailService } from '../mails/mail.service';
import { ActiveUserDto } from './dtos/active-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepository: UserRepository,
    private mailService: MailService,
    private generateCodeUtil: GenerateCodeUtil,
  ) {}

  async createUser(data: CreateUserDto): Promise<{ message: string }> {
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

    await this.mailService.sendCreationConfirmation(newUser);

    return { message: 'User created successfully' };
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAllUsers();
  }

  async findUserById(id: string): Promise<any> {
    const user = await this.userRepository.findUserById(id);

    if (!user) {
      return {
        status: 404,
        data: { message: 'User not found' },
      };
    }

    return {
      status: 200,
      data: user,
    };
  }

  async findUserByNameAndRole(
    fullName?: string,
    specialty?: string,
  ): Promise<UserEntity[]> {
    const users = await this.userRepository.findUserByNameAndRole(
      fullName,
      specialty,
    );

    return users;
  }

  updateLoggedUser(id: string, data: UpdateUserDto): string {
    return 'Feature still in development';
  }

  async desactivateLoggedUser(id: string): Promise<{ message: string }> {
    await this.userRepository.desativateUserById(id);

    return { message: 'User deactivated successfully' };
  }

  async activeUser({ code, email }: ActiveUserDto) {
    const userExists = await this.userRepository.findUserByEmail(email);

    if (!userExists || userExists.code != code) {
      return {
        status: 404,
        data: { message: 'User not found' },
      };
    }

    userExists.code = null;
    userExists.emailConfirmed = true;

    await this.userRepository.updateUser(userExists);

    return {
      status: 200,
      data: { message: 'Email confirmed successfully' },
    };
  }
}
