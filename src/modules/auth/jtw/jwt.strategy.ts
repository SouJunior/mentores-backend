import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { handleError } from 'src/shared/utils/handle-error.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly mentorRepository: MentorRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: { email: string }) {
    const mentor = await this.mentorRepository.findMentorByEmail(payload.email).catch(handleError);

    if (!mentor) {
      throw new UnauthorizedException('mentor not found or not authorized!');
    }

    if (mentor) {
      delete mentor.password;
      return mentor;
    }
  }
}
