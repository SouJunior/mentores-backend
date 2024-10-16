import { Injectable } from '@nestjs/common';
import { MentorRepository } from '../repository/mentor.repository';
import { MentorEntity } from '../entities/mentor.entity';

@Injectable()
export class GetMentorByNameAndRoleService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(
    fullName?: string,
    specialty?: string,
  ): Promise<MentorEntity[]> {
    const users = await this.mentorRepository.findMentorByNameAndRole(
      fullName,
      specialty,
    );

    return users;
  }
}
