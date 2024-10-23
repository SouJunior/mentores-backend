import { Inject, Injectable } from '@nestjs/common';
import { CalendlyRepository } from '../repository/calendly.repository';
import { IHttpAdapter } from 'src/lib/adapter/httpAdapterInterface';


@Injectable()
export class FetchSchedulesService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    @Inject("IHttpAdapter") private readonly httpAdapter: IHttpAdapter
  ) {}

  async getMentorSchedules(mentorId: string) {
    const calendlyInfo = await this.calendlyRepository.getCalendlyInfoByMentorId(mentorId);

    if (!calendlyInfo || !calendlyInfo.calendlyAccessToken) {
      throw new Error('Mentor not connected to Calendly');
    }

    if (!calendlyInfo.calendlyUserUuid) {
      try {
        const response = await this.httpAdapter.get('/users/me', {
          headers: {
            Authorization: `Bearer ${calendlyInfo.calendlyAccessToken}`,
          },
        });

        const mentorUuid = response.resource.uri.split('/').pop();

        await this.calendlyRepository.updateCalendlyInfo(mentorId, {
          calendlyUserUuid: mentorUuid,
        });

        calendlyInfo.calendlyUserUuid = mentorUuid;

        console.log('Fetched mentor UUID:', mentorUuid);
      } catch (error: any) {
        console.error('Error fetching mentor UUID:', error.response?.data);
        throw new Error('Could not fetch mentor UUID from Calendly');
      }
    }

    console.log('Fetching scheduled events for user UUID:', calendlyInfo.calendlyUserUuid);

    const userUrlUuid = `https://api.calendly.com/users/${calendlyInfo.calendlyUserUuid}`;

    try {
      const response = await this.httpAdapter.get(
        `/scheduled_events?user=${userUrlUuid}`,
        {
          headers: {
            Authorization: `Bearer ${calendlyInfo.calendlyAccessToken}`,
          },
        },
      );

      return response.collection;
    } catch (error: any) {
      console.error('Error fetching scheduled events:', error.response?.data);
      throw new Error('Could not fetch scheduled events from Calendly');
    }
  }
}
