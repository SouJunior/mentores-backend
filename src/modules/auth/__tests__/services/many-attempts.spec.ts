import { JwtService } from '@nestjs/jwt';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { MailService } from 'src/modules/mails/mail.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from '../../services/auth.service';
import { InfoEntity } from '../../entity/info.entity';
import { InfoLoginDto } from '../../dtos/info-login.dto';
import { LoginTypeEnum } from '../../enums/login-type.enum';
import { HttpException, HttpStatus } from '@nestjs/common';
import { CalendlyRepository } from 'src/modules/calendly/repository/calendly.repository';

describe('AuthService', () => {
  let authService: AuthService;
  let mentorRepository: MentorRepository;
  let userRepository: UserRepository;
  let jwtService: JwtService;
  let mailService: MailService;
  let calendlyRepository: CalendlyRepository;

  beforeEach(() => {
    mentorRepository = {
      findMentorByEmail: jest.fn(),
      updateMentor: jest.fn(),
    } as any;

    userRepository = {
      findUserByEmail: jest.fn(),
      updateUser: jest.fn(),
    } as any;

    jwtService = {
      sign: jest.fn(),
    } as any;

    mailService = {
      mentorSendCreationConfirmation: jest.fn(),
      userSendCreationConfirmation: jest.fn(),
    } as any;

    authService = new AuthService(
      calendlyRepository,
      mentorRepository,
      userRepository,
      jwtService,
      mailService,
    );
  });

  it('Should throw error if password is invalid and number of attempts is superior to 5', async () => {
    const mockInfo: InfoEntity = {
      id: '1',
      email: 'mentor@example.com',
      password: 'hashedpassword',
      emailConfirmed: true,
      dateOfBirth: '1990-01-01',
      fullName: 'Test Mentor',
      deleted: false,
      accessAttempt: 5,
    };

    const loginData: InfoLoginDto = {
      email: 'mentor@example.com',
      password: 'wrongpassword',
      type: LoginTypeEnum.USER,
    };

    mentorRepository.findMentorByEmail = jest.fn().mockResolvedValue(mockInfo);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

    expect(authService.execute(loginData)).rejects.toThrowError(
      new HttpException(
        {
          message:
            "Your account access is still blocked, because you dont redefined your password after five incorrect tries, please, click on 'Forgot my password' to begin the account restoration.",
        },
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});
