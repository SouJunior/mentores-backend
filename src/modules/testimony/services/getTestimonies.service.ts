import { Injectable } from '@nestjs/common';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { TestimonyRepository } from '../repository/testimony.repository';

@Injectable()
export class GetAllTestimoniesService {
  constructor(private testimonyRepository: TestimonyRepository,
    private mentorRepository: MentorRepository) {}

  async execute() {

    const testimonies = await this.testimonyRepository.findAlltestimony()
    
    const mentors = await this.mentorRepository.findAllMentors()

    for (const testimony of testimonies ) {
      for (const mentor of mentors) {
        
        if (testimony.mentor_id === mentor.id) {
          let mentorSpecialties = mentor.specialties.join(",")

          testimony.imageUrl = mentor.profile
          testimony.role = mentorSpecialties
          testimony.userName = mentor.fullName

          await this.testimonyRepository.editTestimony(testimony.id, testimony )
        }
      }
    }

    return testimonies

  }
}