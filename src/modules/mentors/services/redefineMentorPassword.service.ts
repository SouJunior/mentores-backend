import * as bcrypt from 'bcrypt';
import { ActivateMentorDto } from '../dtos/activate-mentor.dto';
import { MentorRepository } from '../repository/mentor.repository';
import { MentorPassConfirmationDto } from '../dtos/mentor-pass-confirmation.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RedefineMentorPasswordService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(
    queryData: ActivateMentorDto,
    passData: MentorPassConfirmationDto,
  ): Promise<{ message: string }> {
    const mentorExists = await this.mentorRepository.findMentorByEmail(
      queryData.email,
    );

    if (!mentorExists) {
      return {
        message: 'Mentor not found',
      };
    }

    if (mentorExists.code != queryData.code) {
      return {
        message: 'The code is invalid',
      };
    }

    if (passData.password !== passData.confirmPassword) {
      return {
        message: "The passwords don't match",
      };
    }

    mentorExists.password = await bcrypt.hash(passData.password, 10);

    mentorExists.code = null;
    mentorExists.accessAttempt = 0;

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    return {
      message: 'The account was restored sucessfully',
    };
  }
}
