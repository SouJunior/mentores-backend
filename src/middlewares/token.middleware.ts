import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from '../modules/calendly/services/refresh-token.service';
import { MentorRepository } from '../modules/mentors/repository/mentor.repository';
import { CalendlyRepository } from '../modules/calendly/repository/calendly.repository';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly mentorRepository: MentorRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
    private readonly calendlyInfoRepository: CalendlyRepository
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      return res.status(401).send('Authorization token is required');
    }

    let payload;

    try {
      payload = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });
    } catch (error) {
      return res.status(401).send('Invalid token');
    }

    const mentorEmail = payload.email;
    const mentor = await this.mentorRepository.findMentorByEmail(mentorEmail);

    if (!mentor) {
      return res.status(404).send('Mentor not found');
    }

    const calendlyInfo = await this.calendlyInfoRepository.getCalendlyInfoByMentorId(mentor.id);

    if (!calendlyInfo || !calendlyInfo.calendlyAccessToken) {
      return res.status(404).send('Calendly info not found or access token is missing');
    }

    const isExpired = this.isAccessTokenExpired(calendlyInfo.accessTokenExpiration);

    if (isExpired) {
      try {
        await this.refreshTokenService.execute(mentorEmail);
        const updatedCalendlyInfo = await this.calendlyInfoRepository.getCalendlyInfoByMentorId(mentor.id);
        req.headers['Authorization'] = `Bearer ${updatedCalendlyInfo.calendlyAccessToken}`;
      } catch (error) {
        console.error('Error refreshing access token:', error.message);
        return res.status(500).send('Could not refresh access token');
      }
    } else {
      req.headers['Authorization'] = `Bearer ${calendlyInfo.calendlyAccessToken}`;
    }

    next();
  }

  private isAccessTokenExpired(expirationTime: Date): boolean {
    return new Date() >= expirationTime;
  }
}
