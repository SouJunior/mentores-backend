import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserEntity } from '../entity/user.entity';
import { IRepositoryResponse } from '../@Types/user.types';

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
          specialty: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(handleError);
  }

  async findByName(fullName: string): Promise<IRepositoryResponse> {
    const usersByName = await this.users.findMany({ where: { fullName } });

    if (!usersByName.length) {
      console.log(usersByName);
      return {
        message: 'There is no user with that name.',
      };
    }

    return {
      result: usersByName,
      message: 'User(s) found',
    };
  }

  async findBySpecialty(specialty: string): Promise<IRepositoryResponse> {
    const usersBySpecialty = await this.users.findMany({
      where: { specialty },
    });

    if (!usersBySpecialty.length) {
      return {
        message: 'There is no user with that specialty.',
      };
    }

    return {
      result: usersBySpecialty,
      message: 'User(s) found',
    };
  }

  async findUserByNameAndSpecialty(
    fullName: string,
    specialty: string,
  ): Promise<IRepositoryResponse> {
    const usersByNameAndSpecialty = await this.users.findMany({
      where: { fullName, specialty },
    });

    if (!usersByNameAndSpecialty.length) {
      return {
        message: 'There is no user with that name nor specialty.',
      };
    }

    return {
      result: usersByNameAndSpecialty,
      message: 'User(s) found',
    };
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

  async activateUser(userId: string): Promise<void> {
    await this.users.update({
      where: { id: userId },
      data: {
        emailConfirmed: true,
      },
    });

    return;
  }
}
