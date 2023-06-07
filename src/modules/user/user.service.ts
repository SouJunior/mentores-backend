import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';
import { IRepositoryResponse } from './@Types/user.types';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<{ message: string }> {
    data.dateOfBirth = new Date(data.dateOfBirth);

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

  async findUserByNameAndSpecialty(fullName?: string, specialty?: string): Promise<IRepositoryResponse> {

    let result: IRepositoryResponse;

    if(fullName && specialty)
      result = await this.userRepository.findUserByNameAndSpecialty(fullName, specialty);

    if(fullName && !specialty)
      result = await this.userRepository.findByName(fullName);

    if(specialty && !fullName)
      result = await this.userRepository.findBySpecialty(specialty);

    return result;
  }

  updateLoggedUser(id: string, data: UpdateUserDto): string {
    return 'Feature still in development';
  }

  async desactivateLoggedUser(id: string): Promise<{ message: string }> {
    await this.userRepository.desativateUserById(id);

    return { message: 'User deactivated successfully' };
  }

  async activateUser(id: string): Promise<{ message: string }> {
    await this.userRepository.activateUser(id)

    return { message: "User activated successfully"}
    }
}
