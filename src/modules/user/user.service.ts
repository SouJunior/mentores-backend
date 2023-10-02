import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UserRepository } from './user.repository';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mails/mail.service';
import { ActivateUserDto } from './dto/activate-user.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CustomNotFoundException } from 'src/shared/exceptions/notFound.exception';
import { CustomBadRequestException } from 'src/shared/exceptions/badRequest.exception';
import { FileUploadService } from '../upload/upload.service';
import { UserPassConfirmationDto } from './dto/user-pass-confirmation.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository,
  private generateCodeUtil: GenerateCodeUtil,
  private mailService: MailService,
  private fileUploadService: FileUploadService) {}

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

  async activateUser({ code, email }: ActivateUserDto) {
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

  async updateUser(id: string, data: UpdateUserDto) {

    const UserExists = await this.userRepository.findUserById(id)

    if (!UserExists) {
      throw new CustomNotFoundException("There are no User with that id")
    }

    try {
    await this.userRepository.updateUser(id, data)

    return { message: "The User was updated successfully", status: 200}

    } catch(error) {
      throw new CustomBadRequestException("Something went wrong in the database")
    }
  }

  async uploadProfileImage(id: string, user: UpdateUserDto, file) {

    user.profileKey = "genericUserImage"
    if (file && !user.profileKey) {
      throw new CustomBadRequestException("profileKey is required when file is sent")
    }

    if (file) {
      await this.fileUploadService.deleteFile(user.profileKey);
      const { Location, key } = await this.fileUploadService.upload(file);
      user.profile = Location;
      user.profileKey = key;

      await this.userRepository.updateUserUrl(id, user.profile)
    }

    delete user.file
  
    return { message: "The profile image was updated succesfully", status: 200}
  }

  async desactivateLoggedUser(id: string): Promise<{ message: string }> {
    await this.userRepository.desativateUserById(id);

    return { message: 'User deactivated successfully' };
  }
async sendRestorationEmail(email: string): Promise<{
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

  async redefineUserPassword(
    queryData : ActivateUserDto, passData: UserPassConfirmationDto
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
