import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class GetAllUsersService {
  constructor(private userRepository: UserRepository) {}

  async execute(): Promise<UserEntity[]> {
    return this.userRepository.findAllUsers();
  }
}
