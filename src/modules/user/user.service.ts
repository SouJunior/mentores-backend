import { Injectable } from '@nestjs/common';
import { UserEntity } from 'src/database/entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserRepository } from './repository/user.repository';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async createUser(data: CreateUserDto): Promise<{ message: string }> {
    await this.userRepository.createNewUser(data);

    return { message: 'Create user successfully' };
  }

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAllUsers();
  }

  getUserById(id: string): string {
    return id;
  }

  updateUser(): string {
    return 'ok';
  }

  deleteUser(): string {
    return 'ok';
  }
}
