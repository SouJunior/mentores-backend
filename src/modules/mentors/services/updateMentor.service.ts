import { Injectable } from '@nestjs/common';
import { UpdateMentorDto } from '../dtos/update-mentor.dto';
import { MentorRepository } from '../repository/mentor.repository';

@Injectable()
export class UpdateMentorService {
  constructor(private mentorRepository: MentorRepository) {}

  async execute(id: string, data: UpdateMentorDto) {
    const mentorExists = await this.mentorRepository.findMentorById(id);

    if (!mentorExists) {
      return {
        status: 404,
        message: 'There are no mentor with that id',
      };
    }

    if (!data.registerComplete) {
      data.registerComplete = true;
    }

    try {
      await this.mentorRepository.updateMentor(id, data);

      return { message: 'The mentor was updated successfully', status: 200 };
    } catch (error) {
      return {
        status: 400,
        message: 'Something went wrong in the database',
      };
    }
  }
}
