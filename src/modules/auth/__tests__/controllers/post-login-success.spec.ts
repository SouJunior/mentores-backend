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

  it('Should be able to login', async () => {
    const loginData: InfoLoginDto = {
      email: 'example@example.com',
      password: 'password',
      type: LoginTypeEnum.USER,
    };

    const res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

    const mockInfo: InfoEntity = {
      id: '1',
      email: loginData.email,
      password: 'password',
      emailConfirmed: true,
      deleted: false,
      fullName: 'Test Mentor',
      dateOfBirth: '1990-01-01',
      specialties: ['Node.js'],
      accessAttempt: 0,
    };

    const response = {
      status: 200,
      data: {
        token: 'token',
        info: mockInfo,
      },
    };

    jest.spyOn(authService, 'execute').mockResolvedValue(response);
    await controller.login(loginData, res as any);

    expect(authService.execute).toHaveBeenCalledWith(loginData);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(response.data);
  });
});
