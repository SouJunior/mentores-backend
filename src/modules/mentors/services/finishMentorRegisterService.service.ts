import { MentorRepository } from '../repository/mentor.repository';
import {Injectable } from '@nestjs/common';

@Injectable()
export class FinishMentorRegisterService {
  constructor(
    private mentorRepository: MentorRepository,
  ) {}

    async execute(id: string) {
      const mentor = await this.mentorRepository.findMentorById(id)

      if (mentor.registerComplete) {
        return {
          message: 'The user has already finished his registration'
        }
      }
      await this.mentorRepository.registerCompleteToggle(id)

      return {
        message: "The registration was declared as completed."
      }
    }
}
