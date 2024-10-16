import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CustomNotFoundException } from 'src/shared/exceptions/notFound.exception';
import { CustomBadRequestException } from 'src/shared/exceptions/badRequest.exception';

@Injectable()
export class UpdateUserService {
  constructor(private userRepository: UserRepository,
) {}

  async execute(id: string, data: UpdateUserDto) {

    const UserExists = await this.userRepository.findUserById(id)

    if (!UserExists) {
      throw new CustomNotFoundException("There are no User with that id")
    }

    try {
    await this.userRepository.updateUser(id, data)

    return { message: "The User was updated successfully", status: 200}

    } catch(error) {
      throw new CustomBadRequestException("Something went wrong in the database")
    }
  }
}