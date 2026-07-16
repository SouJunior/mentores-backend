import { Injectable } from '@nestjs/common';
import { MentorRepository } from '../repository/mentor.repository';
import { MentorEntity } from '../entities/mentor.entity';

@Injectable()
export class GetMentorBySingleQueryService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(
    query?: string,
  ): Promise<MentorEntity[]> {
    const users = await this.mentorRepository.findMentorsBySingleQuery(
      query,
    );

    return users;
  }
}
