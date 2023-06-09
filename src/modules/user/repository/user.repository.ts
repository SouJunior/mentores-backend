import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';

@Injectable()
export class UserRepository extends PrismaClient {
  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.users.create({ data }).catch(handleError);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.users.findMany().catch(handleError);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.users.findUnique({ where: { email } }).catch(handleError);
  }

  async findUserById(id: string): Promise<any> {
    return this.users
      .findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          email: true,
          specialty: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(handleError);
  }

  async findUserByNameAndRole(
    fullName?: string,
    specialty?: string,
  ): Promise<UserEntity[]> {
    const users = await this.users
      .findMany({
        where: {
          deleted: false,
          fullName: fullName
            ? { contains: fullName, mode: 'insensitive' }
            : undefined,
          specialty: specialty
            ? { contains: specialty, mode: 'insensitive' }
            : undefined,
        },
      })
      .catch(handleError);

    return users;
  }

  async desativateUserById(id: string): Promise<UserEntity> {
    return this.users
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

  async updateUser(user: UserEntity): Promise<void> {
    await this.users
      .update({ where: { id: user.id }, data: user })
      .catch(handleError);

    return;
  }
}
