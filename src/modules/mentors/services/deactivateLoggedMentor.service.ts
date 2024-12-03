import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeactivateLoggedMentorService {
  constructor(
    private mentorRepository: MentorRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    await this.mentorRepository.deactivateMentorById(id);

    return { message: 'Mentor deactivated successfully' };
  }
}
