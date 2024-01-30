import { Injectable } from '@nestjs/common';
import { TestimonyRepository } from './repository/testimony.repository';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import {
  dataFormatter,
} from '../../shared/utils/formatters.utils';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { MentorRepository } from '../mentors/repository/mentor.repository';

@Injectable()
export class TestimonyService {
  constructor(private testimonyRepository: TestimonyRepository,
    private mentorRepository: MentorRepository) {}

  async getTestimonies() {

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

  async createTestimony(
    data: CreateTestimonyDto,
    mentorData: MentorEntity
  ): Promise<{ message: string }> {
    
    const mentorSpecialties = mentorData.specialties.join(",")
    
    data.userName = mentorData.fullName
    data.role = mentorSpecialties
    data.imageUrl = mentorData.profile

    try {

    await this.testimonyRepository.createNewTestimony(data, mentorData.id);

    } catch (error: any) {
      console.log(error)
    }

    return { message: 'Testimony created successfully' };
  }

  async editTestimony(
    id: string,
    data: CreateTestimonyDto,
  ): Promise<{ message: string }> {
    const testimonyExists = await this.testimonyRepository.findTestimonyById(
      id,
    );

    if (!testimonyExists) {
      return { message: 'There are no testimony with that id.' };
    }

    if (
      testimonyExists.userName !== data.userName ||
      testimonyExists.description !== data.description
    ) {
      dataFormatter(data);
    }

    await this.testimonyRepository.editTestimony(id, data);

    return { message: 'Testimony updated successfully' };
  }

  async deleteTestimony(id: string): Promise<{ message: string }> {
    const testimonyExists = await this.testimonyRepository.findTestimonyById(
      id,
    );

    if (!testimonyExists) {
      return { message: 'There are no testimony with that id' };
    }

    await this.testimonyRepository.deleteTestimony(id);

    return { message: 'Testimony deleted successfully' };
  }
}
