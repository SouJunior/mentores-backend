import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailService } from '../mails/mail.service';
import { ActiveUserDto } from './dtos/active-user.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { UserPassConfirmationDto } from './dtos/userPassConfirmation.dto';
import { CustomUsersNotFoundException } from './exceptions/notFound.exception';
import { CustomUsersBadRequestException } from './exceptions/badRequest.exception';

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

  async updateUser(id: string, data: UpdateUserDto) {
    const userExists = await this.userRepository.findUserById(id)

    if (!userExists) {
      throw new CustomUsersNotFoundException("There are no user with that id")
    }

    try {
    await this.userRepository.updateUser(id, data)

    return { message: "The user was updated successfully", status: 200}

    } catch(error) {
      throw new CustomUsersBadRequestException("Something went wrong in the database")
    }
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

    await this.userRepository.updateUser(userExists.id, userExists);

    return {
      status: 200,
      data: { message: 'Email confirmed successfully' },
    };
  }

  async sendRestorationEmail(email: string): Promise<{
    message: string;
    userData?: ActiveUserDto;
  }> {
    const userExists = await this.userRepository.findUserByEmail(email);

    if (!userExists) {
      return {
        message: 'User not found',
      };
    }

    userExists.code = this.generateCodeUtil.create();

    await this.userRepository.updateUser(userExists.id, userExists);

    await this.mailService.sendRestorationEmail(userExists);

    return {
      message: 'E-mail de recuperação enviado',
      userData: { code: userExists.code, email: userExists.email },
    };
  }

  async redefineUserPassword(
    queryData : ActiveUserDto, passData: UserPassConfirmationDto
  ): Promise<{ message: string }> {
    const userExists = await this.userRepository.findUserByEmail(queryData.email);

    if (!userExists) {
      return {
        message: 'User not found',
      };
    }

    if (userExists.code != queryData.code) {
      return {
        message: 'The code is invalid',
      };
    }

    if (passData.password !== passData.confirmPassword) {
      return {
        message: "The passwords don't match",
      };
    }

    userExists.password = await bcrypt.hash(passData.password, 10);

    userExists.code = null;
    userExists.accessAttempt = 0

    await this.userRepository.updateUser(userExists.id, userExists);

    return {
      message: 'The account was restored sucessfully',
    };
  }
}
