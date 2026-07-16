import { Injectable } from '@nestjs/common';

@Injectable()
export class InitiateOAuthService {
  async initiateOAuth(mentorId: string) {
    const params = new URLSearchParams({
      client_id: process.env.SOUJUNIOR_CLIENT_ID,
      redirect_uri: process.env.SOUJUNIOR_REDIRECT_URI,
      response_type: 'code',
      scope: 'user:read:email scheduling:read',
      state: mentorId,
    });

    const url = `https://calendly.com/oauth/authorize?${params.toString()}`;

    console.log(`Redirecting to Calendly OAuth URL: ${url}`);

    return { message: 'OAuth initiated', url };
  }
}
