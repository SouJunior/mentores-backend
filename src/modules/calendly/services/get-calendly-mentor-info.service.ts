import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CalendlyRepository } from "../repository/calendly.repository";


@Injectable()
export class GetCalendlyMentorInfoService {
  constructor(private readonly calendlyRepository: CalendlyRepository) {}

  async execute(mentorId: string) {
    try {
      const calendlyInfo = await this.calendlyRepository.getCalendlyInfoByMentorId(mentorId)
      return calendlyInfo;
    } catch (error) {
      console.error('Error returning Calendly info:', error.message);
      throw new InternalServerErrorException(
        'Could not find Calendly info in the database',
      );
    }
  }
}
