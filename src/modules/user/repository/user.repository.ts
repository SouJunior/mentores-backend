import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends PrismaClient {
  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.user.create({ data }).catch(handleError);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.user.findMany().catch(handleError);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.user.findUnique({ where: { email } }).catch(handleError);
  }

  async findUserById(id: string): Promise<UserEntity> {
    return this.user.findUnique({ where: { id } }).catch(handleError);
  }

  async desativateUserById(id: string): Promise<UserEntity> {
    return this.user
      .update({
        where: {
          id,
        },
        data: {
          deleted: true,
        },
      })
      .catch(handleError);
  }

  async updateAccessAttempts(user: UserEntity): Promise<void> {
    await this.user
      .update({ where: { id: user.id }, data: user })
      .catch(handleError);

    return;
  }
}
