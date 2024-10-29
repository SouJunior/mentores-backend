import { Injectable } from '@nestjs/common';

@Injectable()
export class InitiateOAuthService {
  async initiateOAuth(mentorId: string) {
    const params = new URLSearchParams({
      client_id: process.env.CALENDLY_CLIENT_ID,
      redirect_uri: process.env.CALENDLY_REDIRECT_URI,
      response_type: 'code',
      scope: 'user:read:email scheduling:read',
      state: mentorId,
    });

    const url = `https://calendly.com/oauth/authorize?${params.toString()}`;
    return { url };
  }
}
