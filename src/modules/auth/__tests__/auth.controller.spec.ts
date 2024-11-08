import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { MailService } from 'src/modules/mails/mail.service';
import { JwtService } from '@nestjs/jwt';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { UserRepository } from 'src/modules/user/user.repository';
import { LoginTypeEnum } from '../enums/login-type.enum';

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
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should be able to login', async () => {
    const loginData = {
      email: 'fulano.de.tal@dominio.com',
      password: 'Abcd@123',
      type: LoginTypeEnum.USER,
    };

    const response = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFuby5kZS50YWxAZG9taW5pby5jb20iLCJpYXQiOjE2ODI1NjQyNTMsImV4cCI6MTY4MjY1MDY1M30.9mh1Lxpjde7G50iHNUUmmCnEpmuq5pDSMteCZz6NYyE',
      info: {
        id: '2046f12a-37b3-4d17-b210-8b604e632f7e',
        fullName: 'Fulano de tal',
        dateOfBirth: '2023-04-06T01:48:41.314Z',
        email: 'fulano.de.tal@dominio.com',
        createdAt: '2023-04-24T03:48:29.030Z',
        updatedAt: '2023-04-25T23:29:26.885Z',
        password: 'Abcd@123',
      },
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.spyOn(authService, 'execute').mockResolvedValue({
      status: 200,
      data: response,
    });

    await controller.login(loginData, res as any);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(response);
  });
});
