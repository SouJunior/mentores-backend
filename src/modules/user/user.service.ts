import { Injectable } from '@nestjs/common';
import { UserRepository } from './repository/user.repository';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async getAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.findAllUsers();
  }

  getUserById(id: string): string {
    return id;
  }

  createUser(): string {
    return 'ok';
  }

  updateUser(): string {
    return 'ok';
  }

  //ver se precisa
  deleteUser(): string {
    return 'ok';
  }
}
