import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { AuthService } from '../../services/auth.service';
import { UserRepository } from 'src/modules/user/user.repository';
import { JwtService } from '@nestjs/jwt';
import { MailService } from 'src/modules/mails/mail.service';
import { InfoLoginDto } from '../../dtos/info-login.dto';
import { LoginTypeEnum } from '../../enums/login-type.enum';
import { InfoEntity } from '../../entity/info.entity';
import * as bcrypt from 'bcrypt';
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

    calendlyRepository = {
      getCalendlyInfoByMentorId: jest.fn().mockResolvedValue(null),
    } as any;

    authService = new AuthService(
      calendlyRepository,
      mentorRepository,
      userRepository,
      jwtService,
      mailService,
    );
  });

  describe('execute', () => {
    it('should authenticate and return a token with user info', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword' as never);

      const loginData: InfoLoginDto = {
        email: 'mentor@example.com',
        password: 'password123',
        type: LoginTypeEnum.USER,
      };

      const mockInfo: InfoEntity = {
        id: '1',
        email: loginData.email,
        password: await bcrypt.hash(loginData.password, 10),
        emailConfirmed: true,
        deleted: false,
        fullName: 'Test Mentor',
        dateOfBirth: '1990-01-01',
        specialties: ['Node.js'],
        accessAttempt: 0,
      };

      mentorRepository.findMentorByEmail = jest
        .fn()
        .mockResolvedValue(mockInfo);
        jwtService.sign = jest.fn().mockReturnValue('mocked-token');

      const result = await authService.execute(loginData);

      expect(result).toEqual({
        status: 200,
        data: {
          token: 'mocked-token',
          info: {
            id: mockInfo.id,
            email: mockInfo.email,
            fullName: mockInfo.fullName,
            dateOfBirth: '1990-01-01',
            specialties: mockInfo.specialties,
            calendlyName: "",
          },
        },
      });
    });
  });
});
