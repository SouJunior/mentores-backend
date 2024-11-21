import { HttpException, HttpStatus } from '@nestjs/common';
import { InfoEntity } from '../../entity/info.entity';
import { AuthService } from '../../services/auth.service';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mails/mail.service';
import { LoginTypeEnum } from '../../enums/login-type.enum';
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

  describe('infoConfirm', () => {
    it('should throw an error if the account is not confirmed', async () => {
      const mockInfo: InfoEntity = {
        id: '1',
        email: 'mentor@example.com',
        password: 'hashedpassword',
        emailConfirmed: false,
        dateOfBirth: '1990-01-01',
        fullName: 'Test Mentor',
        deleted: false,
        accessAttempt: 0,
      };

      mentorRepository.findMentorByEmail = jest
        .fn()
        .mockResolvedValue(mockInfo);

      await expect(
        authService.infoConfirm(mockInfo, LoginTypeEnum.USER),
      ).rejects.toThrow(
        new HttpException(
          {
            message:
              'Your account is not activated yet. Check your e-mail inbox for instructions',
          },
          HttpStatus.NOT_FOUND,
        ),
      );
    });
  });
});
