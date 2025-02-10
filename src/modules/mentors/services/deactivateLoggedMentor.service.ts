import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DeactivateLoggedMentorService {
  constructor(
    private mentorRepository: MentorRepository,
  ) {}

  async execute(id: string): Promise<{ message: string }> {
    const mentorExists = await this.mentorRepository.findMentorById(id)

    if (!mentorExists) {
      return {
        message: "Mentor not found"
      }
    }

    if (mentorExists.deleted) {
      return {
        message: "This mentor is already deleted"
      }
    }
    
    await this.mentorRepository.deactivateMentorById(id);

    return { message: 'Mentor deactivated successfully' };
  }
}
