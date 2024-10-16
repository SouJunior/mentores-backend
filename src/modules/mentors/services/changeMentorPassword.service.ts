import * as bcrypt from 'bcrypt';
import { MentorEntity } from '../entities/mentor.entity';
import { MentorRepository } from '../repository/mentor.repository';
import { Injectable } from '@nestjs/common';
import { MentorChangePassDto } from '../dtos/mentor-change-pass.dto';

@Injectable()
export class ChangeMentorPasswordService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(mentor: MentorEntity, data: MentorChangePassDto) {
    const loggedMentor = await this.mentorRepository.findFullMentorById(
      mentor.id,
    );

    const isPassCorrect = await bcrypt.compare(
      data.oldPassword,
      loggedMentor.password,
    );

    if (!isPassCorrect) {
      return {
        status: 400,
        message: 'Incorrect old password',
      };
    }

    loggedMentor.password = await bcrypt.hash(data.password, 10);

    try {
      await this.mentorRepository.updateMentor(mentor.id, loggedMentor);

      return {
        status: 200,
        message: 'Password changed successfully',
      };
    } catch (error) {
      return { status: 400, message: 'Something went wrong in the database' };
    }
  }
}
