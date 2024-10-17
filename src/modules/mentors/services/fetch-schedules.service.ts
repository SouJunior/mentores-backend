import { Injectable } from '@nestjs/common';
import { MentorRepository } from '../repository/mentor.repository';
import { axiosInstance } from 'src/lib/axios';

@Injectable()
export class FetchSchedulesService {
  constructor(private readonly mentorRepository: MentorRepository) {}

  async getMentorSchedules(email: string) {
    const mentor = await this.mentorRepository.findMentorByEmail(email);

    if (!mentor || !mentor.calendlyAccessToken) {
      throw new Error('Mentor not connected to Calendly');
    }

    if (!mentor.calendlyUserUuid) {
      try {
        const response = await axiosInstance.get('/users/me', {
          headers: {
            Authorization: `Bearer ${mentor.calendlyAccessToken}`,
          },
        });

        const mentorUuid = response.data.resource.uri.split('/').pop();

        await this.mentorRepository.updateMentor(mentor.id, {
          calendlyUserUuid: mentorUuid,
        });

        mentor.calendlyUserUuid = mentorUuid;

        console.log('Fetched mentor UUID:', mentorUuid);
      } catch (error: any) {
        console.error('Error fetching mentor UUID:', error.response?.data);
        throw new Error('Could not fetch mentor UUID from Calendly');
      }
    }

    console.log(
      'Fetching scheduled events for user UUID:',
      mentor.calendlyUserUuid,
    );

    const userUrlUuid = `https://api.calendly.com/users/${mentor.calendlyUserUuid}`;

    try {
      const response = await axiosInstance.get(
        `/scheduled_events?user=${userUrlUuid}`,
        {
          headers: {
            Authorization: `Bearer ${mentor.calendlyAccessToken}`,
          },
        },
      );

      return response.data.collection;
    } catch (error: any) {
      console.error('Error fetching scheduled events:', error.response?.data);
      throw new Error('Could not fetch scheduled events from Calendly');
    }
  }
}
