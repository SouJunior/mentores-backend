import { Inject, Injectable } from '@nestjs/common';
import { CalendlyRepository } from '../repository/calendly.repository';
import { IHttpAdapter } from '../../../lib/adapter/httpAdapterInterface';

@Injectable()
export class FetchSchedulesService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    @Inject('IHttpAdapter') private readonly httpAdapter: IHttpAdapter
  ) {}

  async getMentorSchedules(mentorId: string) {
    const calendlyInfo = await this.calendlyRepository.getCalendlyInfoByMentorId(mentorId);

    if (!calendlyInfo || !calendlyInfo.calendlyAccessToken) {
      throw new Error('Mentor not connected to Calendly');
    }

    if (!calendlyInfo.calendlyUserUuid) {
      calendlyInfo.calendlyUserUuid = await this.fetchAndSaveMentorUuid(mentorId, calendlyInfo.calendlyAccessToken);
    }

    const userUrlUuid = `https://api.calendly.com/users/${calendlyInfo.calendlyUserUuid}`;
    try {
      const eventsResponse = await this.httpAdapter.get(
        `/scheduled_events?user=${userUrlUuid}&status=active&sort=start_time:desc`,
        {
          headers: {
            Authorization: `Bearer ${calendlyInfo.calendlyAccessToken}`,
          },
        }
      );

      const filteredEvents = await this.extractRelevantEventData(eventsResponse.collection, calendlyInfo.calendlyAccessToken);
      return filteredEvents;
    } catch (error: any) {
      console.error('Error fetching scheduled events:', error.response?.data);
      throw new Error('Could not fetch scheduled events from Calendly');
    }
  }

  private async fetchAndSaveMentorUuid(mentorId: string, accessToken: string): Promise<string> {
    try {
      const response = await this.httpAdapter.get('/users/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const mentorUuid = response.resource.uri.split('/').pop();
      await this.calendlyRepository.updateCalendlyInfo(mentorId, { calendlyUserUuid: mentorUuid });
      return mentorUuid;
    } catch (error: any) {
      console.error('Error fetching mentor UUID:', error.response?.data);
      throw new Error('Could not fetch mentor UUID from Calendly');
    }
  }

  private async extractRelevantEventData(events: any[], accessToken: string): Promise<any[]> {
    const eventDetails = [];
  
    for (const event of events) {
      const inviteesResponse = await this.httpAdapter.get(`${event.uri}/invitees`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const eventId = event.uri.split('/').pop();
  
      const participants = inviteesResponse.collection.map(invitee => ({
        name: invitee.name,
        email: invitee.email,
        questions: invitee.questions_and_answers.map(qa => ({
          question: qa.question,
          answer: qa.answer,
        })),
      }));
  
      eventDetails.push({
        eventName: event.name,
        description: event.description || 'No description provided',
        startTime: event.start_time,
        endTime: event.end_time,
        duration: this.calculateDuration(event.start_time, event.end_time),
        joinUrl: event.location?.join_url || 'No meeting link provided',
        eventUrl: `https://calendly.com/app/scheduled_events/user/me?period=upcoming&uuid=${eventId}`,
        participants
      });
    }
  
    return eventDetails;
  }

  private calculateDuration(startTime: string, endTime: string): string {
    const durationMs = new Date(endTime).getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    return `${minutes} minutes`;
  }
}
