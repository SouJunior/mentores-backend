import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MentorRepository } from '../../mentors/repository/mentor.repository';
import { axiosCallback } from 'src/lib/axios';

@Injectable()
export class RefreshTokenService {
  constructor(private readonly mentorRepository: MentorRepository) {}

  async execute(mentorEmail: string) {
    const mentor = await this.mentorRepository.findMentorByEmail(mentorEmail);
    if (!mentor || !mentor.calendlyRefreshToken) {
      throw new InternalServerErrorException(
        'Mentor not found or no refresh token available.',
      );
    }

    try {
      const tokenResponse = await axiosCallback.post(
        '/oauth/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: mentor.calendlyRefreshToken,
          client_id: process.env.SOUJUNIOR_CLIENT_ID,
          client_secret: process.env.SOUJUNIOR_CLIENT_SECRET,
        }),
      );

      const accessToken = tokenResponse.data.access_token;
      const expiresIn = tokenResponse.data.expires_in;
      const expirationTime = new Date(Date.now() + expiresIn * 1000);

      await this.mentorRepository.updateMentor(mentor.id, {
        calendlyAccessToken: accessToken,
        accessTokenExpiration: expirationTime,
      });
    } catch (error) {
      console.error(
        'Error refreshing access token:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException('Failed to refresh access token.');
    }
  }
}
