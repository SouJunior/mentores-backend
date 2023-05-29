import { BadRequestException, NotFoundException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserEntity } from './entity/user.entity';
import { UserRepository } from './repository/user.repository';

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

  async findUserByNameAndRole(fullName?: string, role?: string): Promise<UserEntity[]> {

    let users: UserEntity[];

    if(fullName && role)
      users = await this.userRepository.findUserByNameAndRole(fullName, role);

    if(fullName)
      users = await this.userRepository.findByName(fullName);

    if(role)
      users = await this.userRepository.findByRole(role);

    if (!users || users.length === 0) { throw new NotFoundException("user not found"); }

    return users;
  }

  updateLoggedUser(id: string, data: UpdateUserDto): string {
    return 'Feature still in development';
  }

  async desactivateLoggedUser(id: string): Promise<{ message: string }> {
    await this.userRepository.desativateUserById(id);

    return { message: 'User deactivated successfully' };
  }
}
