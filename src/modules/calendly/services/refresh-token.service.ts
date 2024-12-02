import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CalendlyRepository } from '../repository/calendly.repository';
import { IHttpAdapter } from '../../../lib/adapter/httpAdapterInterface';


@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly calendlyRepository: CalendlyRepository,
    @Inject("IHttpAdapter") private readonly httpAdapter: IHttpAdapter
  ) {}

  async execute(mentorId: string) {
    const calendlyInfo = await this.calendlyRepository.getCalendlyInfoByMentorId(mentorId);
    if (!calendlyInfo || !calendlyInfo.calendlyRefreshToken) {
      throw new InternalServerErrorException(
        'No refresh token available for this mentor.',
      );
    }

    try {
      const tokenResponse = await this.httpAdapter.callbackPost(
        '/oauth/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: calendlyInfo.calendlyRefreshToken,
          client_id: process.env.SOUJUNIOR_CLIENT_ID,
          client_secret: process.env.SOUJUNIOR_CLIENT_SECRET,
        }),
      );

      const accessToken = tokenResponse.access_token;
      const expiresIn = tokenResponse.expires_in;
      const expirationTime = new Date(Date.now() + expiresIn * 1000);

      await this.calendlyRepository.updateCalendlyInfo(mentorId, {
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
