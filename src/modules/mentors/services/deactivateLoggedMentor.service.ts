import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DesactivateLoggedMentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(id: string): Promise<{ message: string }> {
    await this.mentorRepository.desativateMentorById(id);

    return { message: 'Mentor deactivated successfully' };
  }
}
