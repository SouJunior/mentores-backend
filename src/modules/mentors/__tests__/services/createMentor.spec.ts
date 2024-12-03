import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateMentorService } from '../../services/createMentor.service';
import { MailService } from 'src/modules/mails/mail.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { CreateMentorDto } from '../../dtos/create-mentor.dto';
import { MentorRepository } from '../../repository/mentor.repository';

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
    expect(result).toEqual({ message: 'Mentor created successfully' });
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
});
