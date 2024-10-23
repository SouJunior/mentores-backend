import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CalendlyRepository } from "../repository/calendly.repository";
import { UpdateCalendlyInfoDto } from "../dto/calendly-info-dto";


@Injectable()
export class UpdateCalendlyInfoService {
  constructor(private readonly calendlyRepository: CalendlyRepository) {}

  async execute(mentorId: string, data: UpdateCalendlyInfoDto) {
    try {
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
