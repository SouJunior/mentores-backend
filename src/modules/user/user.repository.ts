import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from 'src/shared/utils/handle-error.util';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UserRepository extends PrismaClient {
  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.users.create({ data }).catch(handleError);
  }

  async findAllUsers(): Promise<UserEntity[]> {
    return this.users.findMany().catch(handleError);
  }

  async findUserByEmail(email: string): Promise<UserEntity> {
    return this.users
      .findUnique({
        where: { email },
      })
      .catch(handleError);
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
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(handleError);
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

  async updateUser(id: string, data: UpdateUserDto): Promise<void> {
    await this.users.update({ where: { id }, data }).catch(handleError);
  }

  async updateUserUrl(id: string, urlImage: string): Promise<void> {
    await this.users
      .update({ where: { id }, data: { profile: urlImage } })
      .catch(handleError);
  }
}
