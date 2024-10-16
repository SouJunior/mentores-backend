import { ActivateMentorDto } from '../dtos/activate-mentor.dto';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ActivateMentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute({ code, email }: ActivateMentorDto) {
    const mentorExists = await this.mentorRepository.findMentorByEmail(email);

    if (!mentorExists || mentorExists.code != code) {
      return {
        status: 404,
        data: { message: 'Mentor not found' },
      };
    }

    mentorExists.code = null;
    mentorExists.emailConfirmed = true;

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    return {
      status: 200,
      data: { message: 'Email confirmed successfully' },
    };
  }
}
