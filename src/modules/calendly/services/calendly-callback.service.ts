import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalendlyRepository } from '../repository/calendly.repository';
import { IHttpAdapter } from '../../../lib/adapter/httpAdapterInterface';


@Injectable()
export class OAuthCallbackService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    @Inject("IHttpAdapter") private readonly httpAdapter: IHttpAdapter
  ) {}

  async execute(code: string, mentorId: string) {
    if (!mentorId) {
      throw new InternalServerErrorException(
        'Mentor ID is required to proceed with OAuth.',
      );
    }

    try {
      const tokenResponse = await this.httpAdapter.callbackPost(
        '/oauth/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: process.env.SOUJUNIOR_REDIRECT_URI,
          client_id: process.env.SOUJUNIOR_CLIENT_ID,
          client_secret: process.env.SOUJUNIOR_CLIENT_SECRET,
        }),
      );

      const accessToken = tokenResponse.access_token;
      const refreshToken = tokenResponse.refresh_token;
      const expiresIn = tokenResponse.expires_in;
      const expirationTime = new Date(Date.now() + expiresIn * 1000);

      await this.calendlyRepository.updateCalendlyInfo(mentorId, {
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
