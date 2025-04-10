import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateMentorService } from '../../services/createMentor.service';
import { MailService } from 'src/modules/mails/mail.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { makeMentor } from 'src/test/factories/make-mentor';
import { CreateMentorDto } from '../../dtos/create-mentor.dto';

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

  it('Should create a mentor and send a confirmation e-mail', async () => {
    const mentorData = makeMentor({ email: 'mentor@example.com', fullName: 'Mentor Test' });

    const result = await createMentorService.execute(mentorData);
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

  it('Should throw and error if the mentor already exists', async () => {
    const mentorData = makeMentor({ email: 'mentor@example.com' });

    await createMentorService.execute(mentorData);

    await expect(createMentorService.execute(mentorData)).rejects.toThrow(
      'Bad Request: User already exists',
    );
    expect(inMemoryMentorRepository.mentors.length).toEqual(1);
  });

  it('Should throw and error if the e-mail is invalid', async () => {
    const invalidMentorData = makeMentor({ email: 'invalid-email' });

    const mentorDto = plainToClass(CreateMentorDto, invalidMentorData);
    const errors = await validate(mentorDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.isEmail).toBeDefined();

    expect(inMemoryMentorRepository.mentors.length).toEqual(0);
  });

  it('Should create a mentor even without optional fields', async () => {
    const mentorData = makeMentor({ aboutMe: undefined });

    const result = await createMentorService.execute(mentorData);

    expect(inMemoryMentorRepository.mentors.length).toEqual(1);
    expect(result).toEqual({ message: 'Mentor created successfully', statusCode: 201 });
  });

  it('Should throw an error if the password is not strong enough', async () => {
    const weakPasswordData = makeMentor({ password: '12345' });

    const mentorDto = plainToClass(CreateMentorDto, weakPasswordData);
    const errors = await validate(mentorDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.matches).toBeDefined();

    expect(inMemoryMentorRepository.mentors.length).toEqual(0);
  });

  it('Should throw and error if the date of birth is invalid', async () => {
    const invalidDateData = makeMentor({ dateOfBirth: new Date('2090-01-01').toISOString() });

    const mentorDto = plainToClass(CreateMentorDto, invalidDateData);
    const errors = await validate(mentorDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints?.maxDate).toBeDefined();

    expect(inMemoryMentorRepository.mentors.length).toEqual(0);
  });

  it('Should grant that the mentor password was hashed correctly', async () => {
    const mentorData = makeMentor({ email: 'hash.password@example.com', password: 'Password@123' });

    const mentorDto = plainToClass(CreateMentorDto, mentorData);
    const errors = await validate(mentorDto);

    console.log(errors)
    expect(errors.length).toBe(0);

    const result = await createMentorService.execute(mentorData);
    const createdMentor = inMemoryMentorRepository.mentors[0];

    expect(createdMentor.password).toMatch(/^\$2[ayb]\$.{56}$/);

    expect(result).toEqual({ message: 'Mentor created successfully', statusCode: 201 });
  });
});
