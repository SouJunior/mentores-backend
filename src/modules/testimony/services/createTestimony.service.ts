import { Injectable } from '@nestjs/common';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { MentorEntity } from 'src/modules/mentors/entities/mentor.entity';
import { TestimonyRepository } from '../repository/testimony.repository';

@Injectable()
export class CreateTestimonyService {
  constructor(private testimonyRepository: TestimonyRepository) {}

  async execute(
    data: CreateTestimonyDto,
    mentorData: MentorEntity,
  ): Promise<{ message: string }> {
    const mentorSpecialties = mentorData.specialties.join(',');

    data.userName = mentorData.fullName;
    data.role = mentorSpecialties;
    data.imageUrl = mentorData.profile;

    try {
      await this.testimonyRepository.createNewTestimony(data, mentorData.id);
    } catch (error: any) {
      console.log(error);
    }

    return { message: 'Testimony created successfully' };
  }
}
