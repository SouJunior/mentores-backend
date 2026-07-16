import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/service/prisma.service';
import { AppModule } from 'src/app.module';
import request from 'supertest';

describe('Activate mentor (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  test('[PATCH] /mentor/active - Success case', async () => {
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        dateOfBirth: new Date('1990-01-01'),
        emailConfirmed: false,
        code: '1234',
        specialties: [],
      },
    });

    const response = await request(app.getHttpServer())
      .patch('/mentor/active')
      .query({ email: mentor.email, code: '1234' });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      message: 'Email confirmed successfully',
    });

    const updatedMentor = await prisma.mentors.findUnique({
      where: { email: mentor.email },
    });

    expect(updatedMentor.emailConfirmed).toBe(true);
    expect(updatedMentor.code).toBeNull();
  });

  test('[PATCH] /mentor/active - Error when mentor not found', async () => {
    const response = await request(app.getHttpServer())
      .patch('/mentor/active')
      .query({ email: 'notfound@example.com', code: 'wrong-code' });

    console.log(response.body);
    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: 'Mentor not found',
    });
  });

  test('[PATCH] /mentor/active - Error when code is incorrect', async () => {
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'hashedPassword',
        dateOfBirth: new Date('1995-01-01'),
        emailConfirmed: false,
        code: '5678',
        specialties: [],
      },
    });

    const response = await request(app.getHttpServer())
      .patch('/mentor/active')
      .query({ email: mentor.email, code: 'wrong-code' });

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({
      message: 'Mentor not found',
    });

    const nonUpdatedMentor = await prisma.mentors.findUnique({
      where: { email: mentor.email },
    });

    expect(nonUpdatedMentor.emailConfirmed).toBe(false);
    expect(nonUpdatedMentor.code).toBe('5678');
  });

  test('[PATCH] /mentor/active - Error when email or code is missing', async () => {
    const response = await request(app.getHttpServer())
      .patch('/mentor/active')
      .query({ email: 'missing.code@example.com' });

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toContain('code must be a string');
  });

  afterEach(async () => {
    await prisma.mentors.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });
});
