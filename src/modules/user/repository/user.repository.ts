import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import Prisma from 'prisma';

@Injectable()
export class UserRepository extends PrismaClient {
  async createNewUser(data: CreateUserDto): Promise<UserEntity> {
    return this.users.create({ data });
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
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(handleError);
  }

  async findByName(fullName: string): Promise<UserEntity[]> {
    return this.users
      .findMany({where: { fullName }})
      .catch(handleError)
  }

  async findByRole(role: string): Promise<UserEntity[]> {
    return this.users
      .findMany({where: { role }})
      .catch(handleError)
  }

  async findUserByNameAndRole(
    fullName: string,
    role: string,
  ): Promise<UserEntity[]> {

    return this.users.findMany({ where:{ fullName, role } }).catch(handleError);
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

  async updateAccessAttempts(user: UserEntity): Promise<void> {
    await this.users
      .update({ where: { id: user.id }, data: user })
      .catch(handleError);

    return;
  }
}
