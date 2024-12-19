import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateMentorService } from '../../services/createMentor.service';
import { MailService } from 'src/modules/mails/mail.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { CreateMentorDto } from '../../dtos/create-mentor.dto';
import { MentorRepository } from '../../repository/mentor.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

const mockMailService = {
  mentorSendCreationConfirmation: vi.fn(),
};

let inMemoryMentorRepository: InMemoryMentorRepository;

describe('CreateMentorService', () => {
  let createMentorService: CreateMentorService;

  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();

    createMentorService = new CreateMentorService(
      inMemoryMentorRepository as unknown as MentorRepository,
      mockMailService as unknown as MailService,
    );

    vi.clearAllMocks();
  });

  it('Deve criar um mentor e enviar um e-mail de confirmação', async () => {
    const mentorData: CreateMentorDto = {
      email: 'mentor@example.com',
      password: 'password123',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
    };

    const result = await createMentorService.execute(mentorData as any);
    expect(mockMailService.mentorSendCreationConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'mentor@example.com',
        fullName: 'Mentor Test',
        code: expect.any(String),
      }),
    );
    expect(inMemoryMentorRepository.mentors.length).toEqual(1);
    expect(result).toEqual({ message: 'Mentor created successfully', statusCode: 201 });
  });

  it('Deve lançar erro caso o mentor já exista', async () => {
    const mentorData: CreateMentorDto = {
      email: 'mentor@example.com',
      password: 'password123',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
    };

    await createMentorService.execute(mentorData);

    await expect(createMentorService.execute(mentorData)).rejects.toThrow(
      'Bad Request: User already exists',
    );
    expect(inMemoryMentorRepository.mentors.length).toEqual(1);
  });

  it('Deve lançar erro caso o e-mail seja inválido', async () => {
    const invalidMentorData: CreateMentorDto = {
      email: 'invalid-email',
      password: 'Password@123',
      fullName: 'Invalid Email Test',
      dateOfBirth: new Date('1990-01-01'),
    };

    const mentorDto = plainToClass(CreateMentorDto, invalidMentorData);
    const errors = await validate(mentorDto);
  
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();

    expect(inMemoryMentorRepository.mentors.length).toEqual(0);
  });

  it('Deve criar um mentor mesmo com campos opcionais ausentes', async () => {
    const mentorData: CreateMentorDto = {
      email: 'mentor.optional@example.com',
      password: 'password123',
      fullName: 'Mentor Optional Test',
      dateOfBirth: new Date('1990-01-01'),
    };

    const result = await createMentorService.execute(mentorData as any);

    expect(inMemoryMentorRepository.mentors.length).toEqual(1);
    expect(result).toEqual({ message: 'Mentor created successfully' , statusCode: 201});
  });

it('Deve lançar erro caso a senha não seja forte o suficiente', async () => {
  const weakPasswordData: CreateMentorDto = {
    email: 'weak.password@example.com',
    password: '12345',
    fullName: 'Weak Password Test',
    dateOfBirth: new Date('1990-01-01'),
  };

  const mentorDto = plainToClass(CreateMentorDto, weakPasswordData);
  const errors = await validate(mentorDto);
  
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0].constraints?.matches).toBeDefined();
  
  expect(inMemoryMentorRepository.mentors.length).toEqual(0);
});

it('Deve lançar erro caso a data de nascimento seja inválida', async () => {
  const invalidDateData: CreateMentorDto = {
    email: 'invalid.date@example.com',
    password: 'Password@123',
    fullName: 'Invalid Date Test',
    dateOfBirth: new Date('2090-01-01'),
  };

  const mentorDto = plainToClass(CreateMentorDto, invalidDateData);
  const errors = await validate(mentorDto);
  
  expect(errors.length).toBeGreaterThan(0);
  expect(errors[0].constraints?.maxDate).toBeDefined();
  
  expect(inMemoryMentorRepository.mentors.length).toEqual(0);
});

it('Deve garantir que a senha do mentor foi "hashada" corretamente', async () => {
  const mentorData: CreateMentorDto = {
    email: 'hash.password@example.com',
    password: 'Password@123',
    fullName: 'Hash Password Test',
    dateOfBirth: new Date('1990-01-01'),
  };

  const mentorDto = plainToClass(CreateMentorDto, mentorData);
  const errors = await validate(mentorDto);
  expect(errors.length).toBe(0);

  const result = await createMentorService.execute(mentorData as any);
  const createdMentor = inMemoryMentorRepository.mentors[0];

  expect(createdMentor.password).toMatch(/^\$2[ayb]\$.{56}$/);

  expect(result).toEqual({ message: 'Mentor created successfully' , statusCode: 201});
});
});
