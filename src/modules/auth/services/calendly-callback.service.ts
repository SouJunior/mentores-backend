import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { MentorRepository } from '../../mentors/repository/mentor.repository';
import { axiosCallback, axiosInstance } from 'src/lib/axios';

@Injectable()
export class OAuthCallbackService {
  constructor(private readonly mentorRepository: MentorRepository) {}

  async execute(code: string, email: string) {
    if (!email) {
      throw new InternalServerErrorException(
        'Email is required to proceed with OAuth.',
      );
    }

    try {
      const tokenResponse = await axiosCallback.post(
        '/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.SOUJUNIOR_REDIRECT_URI,
          client_id: process.env.SOUJUNIOR_CLIENT_ID,
          client_secret: process.env.SOUJUNIOR_CLIENT_SECRET,
        }),
      );

      const accessToken = tokenResponse.data.access_token;
      const refreshToken = tokenResponse.data.refresh_token;
      const expiresIn = tokenResponse.data.expires_in;
      const expirationTime = new Date(Date.now() + expiresIn * 1000);

      const mentor = await this.mentorRepository.findMentorByEmail(email);
      if (!mentor) {
        throw new InternalServerErrorException('Mentor not found');
      }

      await this.mentorRepository.updateMentor(mentor.id, {
        calendlyAccessToken: accessToken,
        calendlyRefreshToken: refreshToken,
        accessTokenExpiration: expirationTime,
      });

      return { message: 'OAuth successful' };
    } catch (error) {
      console.error(
        'Error during OAuth process:',
        error.response?.data || error.message,
      );
      throw new InternalServerErrorException(
        'OAuth process failed. Please try again.',
      );
    }
  }
}
