import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CreateMentorService } from '../../services/createMentor.service';
import { MailService } from 'src/modules/mails/mail.service';
import { FakeHasher } from 'src/test/cryptography/fake-hasher';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';

const mockMentorRepository = {
  findMentorByEmail: vi.fn(),
  createNewMentor: vi.fn(),
};

const mockMailService = {
  mentorSendCreationConfirmation: vi.fn(),
};

const mockGenerateCodeUtil = {
  create: vi.fn().mockReturnValue('123456'),
};

describe('CreateMentorService', () => {
  let createMentorService: CreateMentorService;
  let fakeHasher: FakeHasher;

  beforeEach(() => {
    fakeHasher = new FakeHasher()

    createMentorService = new CreateMentorService(
      mockMentorRepository as unknown as InMemoryMentorRepository,
      mockMailService as unknown as MailService,
      mockGenerateCodeUtil as unknown as GenerateCodeUtil,
    );

    vi.clearAllMocks();
  });

  it('deve criar um mentor e enviar um e-mail de confirmação', async () => {
    const mentorData = {
      email: 'mentor@example.com',
      password: 'password123',
      passwordConfirmation: 'password123',
      emailConfirm: true,
      fullName: 'Mentor Test',
      dateOfBirth: '1990-01-01',
    };

    mockMentorRepository.findMentorByEmail.mockResolvedValue(null);
    mockMentorRepository.createNewMentor.mockResolvedValue({
      ...mentorData,
      id: 1,
      code: '123456',
    });

    mentorData.password = await fakeHasher.hash(mentorData.password)

    const result = await createMentorService.execute(mentorData as any);

    expect(mockMentorRepository.findMentorByEmail).toHaveBeenCalledWith(
      mentorData.email,
    );
    expect(mockMentorRepository.createNewMentor).toHaveBeenCalledWith(
      expect.objectContaining({
        password: 'password123-hashed',
        code: '123456',
      }),
    );

    expect(mockMailService.mentorSendCreationConfirmation).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'mentor@example.com',
        code: '123456',
        fullName: 'Mentor Test',
      }),
    );

    expect(result).toEqual({ message: 'Mentor created successfully' });
  });

  it('deve lançar erro caso o mentor já exista', async () => {
    const mentorData = {
      email: 'mentor@example.com',
      password: 'password123',
      fullName: 'Mentor Test',
    };

    mockMentorRepository.findMentorByEmail.mockResolvedValue({
      email: 'mentor@example.com',
    });

    await expect(createMentorService.execute(mentorData as any)).rejects.toThrow(
      "Bad Request: User already exists",
    );

    expect(mockMentorRepository.createNewMentor).not.toHaveBeenCalled();
    expect(mockMailService.mentorSendCreationConfirmation).not.toHaveBeenCalled();
  });
});