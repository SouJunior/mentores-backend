import { Injectable } from '@nestjs/common';
import { MentorRepository } from '../repository/mentor.repository';

@Injectable()
export class GetMentorByIdService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(id: string): Promise<any> {
    const user = await this.mentorRepository.findMentorById(id);

    if (!user) {
      return {
        status: 404,
        data: { message: 'Mentor not found' },
      };
    }

    return {
      status: 200,
      data: user,
    };
  }
}
