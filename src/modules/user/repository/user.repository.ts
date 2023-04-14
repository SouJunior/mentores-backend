import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.userRepository.save(data);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.userRepository.find().catch(handleError);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.userRepository
      .findOne({
        where: {
          email,
        },
      })
      .catch(handleError);
  }
}
