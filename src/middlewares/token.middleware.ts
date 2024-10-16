import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { RefreshTokenService } from 'src/modules/auth/services/refresh-token.service';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';

@Injectable()
export class TokenMiddleware implements NestMiddleware {
  constructor(
    private readonly mentorRepository: MentorRepository,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly jwtService: JwtService,
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

    const isExpired = this.isAccessTokenExpired(mentor.accessTokenExpiration);

    if (isExpired) {
      try {
        await this.refreshTokenService.execute(mentorEmail);
        const updatedMentor = await this.mentorRepository.findMentorByEmail(
          mentorEmail,
        );
        req.headers[
          'Authorization'
        ] = `Bearer ${updatedMentor.calendlyAccessToken}`;
      } catch (error) {
        console.error('Error refreshing access token:', error.message);
        return res.status(500).send('Could not refresh access token');
      }
    } else {
      req.headers['Authorization'] = `Bearer ${mentor.calendlyAccessToken}`;
    }

    next();
  }

  private isAccessTokenExpired(expirationTime: Date): boolean {
    return new Date() >= expirationTime;
  }
}
