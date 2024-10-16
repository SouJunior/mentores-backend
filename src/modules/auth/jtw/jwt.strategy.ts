import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { handleError } from 'src/shared/utils/handle-error.util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly mentorRepository: MentorRepository,
    private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.SECRET_KEY,
    });
  }

  async validate(payload: { email: string }) {
    const mentor = await this.mentorRepository.findMentorByEmail(payload.email).catch(handleError);

    const user = await this.userRepository.findUserByEmail(payload.email).catch(handleError)

    if (!mentor && !user) {
      throw new UnauthorizedException('User not found or not authorized!');
    }

    if (mentor) {
      delete mentor.password;
      return mentor;
    } 

    if (user) {
      delete user.password;
      return user;
    } 
  }
}
