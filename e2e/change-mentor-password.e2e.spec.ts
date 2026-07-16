import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/service/prisma.service';
import { AppModule } from 'src/app.module';
import request from 'supertest';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcrypt"

describe('Change mentor password (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwtService: JwtService;

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
    jwtService = moduleRef.get(JwtService);

    await app.init();
  });

  test('[PUT] /mentor/change_password - Success case', async () => {

    const hashedOldPassword = await bcrypt.hash('hashedPassword', 10)
    
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: hashedOldPassword, 
        dateOfBirth: new Date('1990-01-01'),
        emailConfirmed: true,
        code: '1234',
        specialties: [],
      },
    });

    
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });

    const dto = {
      oldPassword: 'hashedPassword', 
      password: 'NewPassword@123',   
      confirmPassword: 'NewPassword@123',
    };

    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`); 

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Password changed successfully');

    
    const updatedMentor = await prisma.mentors.findUnique({
      where: { email: mentor.email },
    });

    
    expect(updatedMentor.password).not.toBe('hashedPassword');
  });

  test('[PUT] /mentor/change_password - Incorrect old password', async () => {
    
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'Jane Doe',
        email: 'jane.doe@example.com',
        password: 'hashedPassword', 
        dateOfBirth: new Date('1995-01-01'),
        emailConfirmed: true,
        code: '5678',
        specialties: [],
      },
    });

    
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });

    const dto = {
      oldPassword: 'WrongPassword123',  
      password: 'NewPassword@123',      
      confirmPassword: 'NewPassword@123',
    };

    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message).toBe('Incorrect old password');
  });

  test('[PUT] /mentor/change_password - Password mismatch', async () => {
    
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'Alice Doe',
        email: 'alice.doe@example.com',
        password: 'hashedPassword', 
        dateOfBirth: new Date('1985-01-01'),
        emailConfirmed: true,
        code: '9012',
        specialties: [],
      },
    });

    
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });

    const dto = {
      oldPassword: 'hashedPassword',   
      password: 'NewPassword@123',     
      confirmPassword: 'DifferentPassword@123',  
    };

    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`);

    expect(response.statusCode).toBe(400);
    expect(response.body.message[0]).toBe('The password does not match with the password confirmation');
  });

  test('[PUT] /mentor/change_password - Unauthorized (no token)', async () => {
    const dto = {
      oldPassword: 'hashedPassword',
      password: 'NewPassword@123',
      confirmPassword: 'NewPassword@123',
    };
  
    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto);
  
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe('Unauthorized');
  });

  test('[PUT] /mentor/change_password - Invalid password format', async () => {
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword', 
        dateOfBirth: new Date('1990-01-01'),
        emailConfirmed: true,
        code: '1234',
        specialties: [],
      },
    });
  
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });
  
    const dto = {
      oldPassword: 'hashedPassword',
      password: '123',
      confirmPassword: '123',
    };
  
    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`);
      
      console.log(response.body)

    expect(response.statusCode).toBe(400);
    expect(response.body.message[0]).toBe('Password must have a minimum of 8 characters, a capital letter, a number and a symbol');
  });
  
  test('[PUT] /mentor/change_password - New password not provided', async () => {
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword',
        dateOfBirth: new Date('1990-01-01'),
        emailConfirmed: true,
        code: '1234',
        specialties: [],
      },
    });
  
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });
  
    const dto = {
      oldPassword: 'hashedPassword',
      confirmPassword: 'NewPassword@123',
    };
  
    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`);

      console.log(response.body)
  
    expect(response.statusCode).toBe(400);
    expect(response.body.message[2]).toBe("the 'password' field must not be empty");
  });

  test('[PUT] /mentor/change_password - Old password not provided', async () => {
    const mentor = await prisma.mentors.create({
      data: {
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedPassword', 
        dateOfBirth: new Date('1990-01-01'),
        emailConfirmed: true,
        code: '1234',
        specialties: [],
      },
    });
  
    const jwtToken = jwtService.sign({ email: mentor.email, sub: mentor.id });
  
    const dto = {
      password: 'NewPassword@123',
      confirmPassword: 'NewPassword@123',
    };
  
    const response = await request(app.getHttpServer())
      .put('/mentor/change_password')
      .send(dto)
      .set('Authorization', `Bearer ${jwtToken}`);

      console.log(response.body)
  
    expect(response.statusCode).toBe(400);
    expect(response.body.message[1]).toBe("the 'oldPassword' field must not be empty");
  });
  
  afterEach(async () => {
    await prisma.mentors.deleteMany()
  })

  afterAll(async () => {
    await app.close();
  });
});
