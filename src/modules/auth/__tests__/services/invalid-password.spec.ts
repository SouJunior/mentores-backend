import { AuthService } from '../../services/auth.service';
import { UserRepository } from 'src/modules/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mails/mail.service';
import { InfoLoginDto } from '../../dtos/info-login.dto';
import { LoginTypeEnum } from '../../enums/login-type.enum';
import { InfoEntity } from '../../entity/info.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CalendlyRepository } from 'src/modules/calendly/repository/calendly.repository';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';

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

  it('Should throw error if password is invalid and increment accessAttempt', async () => {
    const loginData: InfoLoginDto = {
      email: 'mentor@example.com',
      password: 'wrongpassword',
      type: LoginTypeEnum.USER,
    };

    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

    const mockInfo: InfoEntity = {
      id: '1',
      email: loginData.email,
      password: await bcrypt.hash('correctpassword', 10),
      emailConfirmed: true,
      deleted: false,
      dateOfBirth: '1990-01-01',
      fullName: 'Test Mentor',
      accessAttempt: 0,
    };

    mentorRepository.findMentorByEmail = jest.fn().mockResolvedValue(mockInfo);

    await expect(authService.execute(loginData)).rejects.toThrow(
      new HttpException(
        { message: 'Invalid e-mail or password' },
        HttpStatus.NOT_FOUND,
      ),
    );
    expect(mentorRepository.updateMentor).toHaveBeenCalledWith(mockInfo.id, {
      ...mockInfo,
      accessAttempt: 1,
    });
  });
});
