import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<{ message: string }> {
    const userAlreadyExists = await this.userRepository.findUserByEmail(
      data.email,
    );

    if (userAlreadyExists) {
      throw new BadRequestException('User already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);

    delete data.passwordConfirmation;
    delete data.emailConfirm;

    await this.userRepository.createNewUser(data);

    return { message: 'Create user successfully' };
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

  updateLoggedUser(id: string, data: UpdateUserDto): string {
    return 'Funcionalidade ainda em desenvolvimento';
  }

  async desactivateLoggedUser(id: string): Promise<{ message: string }> {
    await this.userRepository.desativateUserById(id);

    return { message: 'User desactivated successfully' };
  }
}
