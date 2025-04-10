import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard, PassportModule } from '@nestjs/passport';
import { MailService } from 'src/modules/mails/mail.service';
import { JwtService } from '@nestjs/jwt';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { AuthController } from '../../auth.controller';
import { AuthService } from '../../services/auth.service';
import { LoginTypeEnum } from '../../enums/login-type.enum';
import { InfoLoginDto } from '../../dtos/info-login.dto';
import { InfoEntity } from '../../entity/info.entity';
import { MentorEntity } from 'src/modules/mentors/entities/mentor.entity';

describe('Auth Controller Tests', () => {
  let module: TestingModule;
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: MailService,
          useValue: { sendMail: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: { sign: jest.fn(), verify: jest.fn() },
        },
        {
          provide: MentorRepository,
          useValue: {},
        },
        {
          provide: UserRepository,
          useValue: {},
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn(() => true),
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return the logged mentor', async () => {
    const mockMentor = new MentorEntity();
    mockMentor.id = '1';
    mockMentor.fullName = 'Example User';
    mockMentor.dateOfBirth = new Date('1990-01-01');
    mockMentor.password = 'hashed-password';
    mockMentor.email = 'example@example.com';
    mockMentor.specialties = ['JavaScript', 'Node.js'];
    mockMentor.role = 'mentor';
    mockMentor.gender = 'male';
    mockMentor.aboutMe = 'Experienced mentor in full-stack development';
    mockMentor.createdAt = new Date();
    mockMentor.updatedAt = new Date();

    const result = await controller.userLogged(mockMentor as any);

    expect(result).toEqual(mockMentor);
  });
});
