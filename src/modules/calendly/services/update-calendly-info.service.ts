import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CalendlyRepository } from "../repository/calendly.repository";
import { UpdateCalendlyInfoDto } from "../dto/calendly-info-dto";
import { MentorRepository } from "../../../modules/mentors/repository/mentor.repository";


@Injectable()
export class UpdateCalendlyInfoService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    private readonly mentorRepository: MentorRepository
  ) {}

  async execute(mentorId: string, data: UpdateCalendlyInfoDto) {
    try {

      const mentorData = await this.mentorRepository.findMentorById(mentorId)

      mentorData.registerComplete = true

      await this.mentorRepository.updateMentor(mentorId, mentorData)

      const calendlyInfo = await this.calendlyRepository.updateCalendlyInfo(
        mentorId,
        data,
      );
      
      return calendlyInfo;
    } catch (error) {
      console.error('Error updating Calendly info:', error.message);
      throw new InternalServerErrorException(
        'Could not update Calendly info in the database',
      );
    }
  }
}
