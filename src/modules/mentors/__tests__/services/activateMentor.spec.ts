import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { ActivateMentorService } from '../../services/activateMentor.service';
import { MentorRepository } from '../../repository/mentor.repository';
import { ActivateMentorDto } from '../../dtos/activate-mentor.dto';


let inMemoryMentorRepository: InMemoryMentorRepository;
let activateMentorService: ActivateMentorService;

describe('ActivateMentorService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    activateMentorService = new ActivateMentorService(inMemoryMentorRepository as unknown as MentorRepository);
  });

  it('Should activate a mentor with correct code and email', async () => {
    const mentor = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Password@123',
    });

    mentor.code = '123456';
    await inMemoryMentorRepository.updateMentor(mentor.id, mentor);

    const dto: ActivateMentorDto = {
      email: 'mentor@example.com',
      code: '123456',
    };

    const result = await activateMentorService.execute(dto);

    expect(result.status).toBe(200);
    expect(result.data.message).toBe('Email confirmed successfully');

    const updatedMentor = await inMemoryMentorRepository.findMentorByEmail('mentor@example.com');

    expect(updatedMentor?.emailConfirmed).toBe(true);
    expect(updatedMentor?.code).toBeNull();
  });

  it('Should return an error when activating a mentor with an incorrect code', async () => {
    const mentor = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Password@123',
    });

    mentor.code = '123456';
    await inMemoryMentorRepository.updateMentor(mentor.id, mentor);

    const dto: ActivateMentorDto = {
      email: 'mentor@example.com',
      code: 'wrongcode',
    };

    const result = await activateMentorService.execute(dto);

    expect(result.status).toBe(404);
    expect(result.data.message).toBe('Mentor not found');

    const updatedMentor = await inMemoryMentorRepository.findMentorByEmail('mentor@example.com');

    expect(updatedMentor?.emailConfirmed).toBeFalsy();
    expect(updatedMentor?.code).toBe('123456');
  });

  it('Should return an error when trying to activate a nonexistent mentor', async () => {
    const dto: ActivateMentorDto = {
      email: 'nonexistent@example.com',
      code: '123456',
    };

    const result = await activateMentorService.execute(dto);

    expect(result.status).toBe(404);
    expect(result.data.message).toBe('Mentor not found');
  });

  it('Should return an error if the mentor does not have an associated code', async () => {
    const mentor = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Password@123',
    });

    mentor.code = null;
    await inMemoryMentorRepository.updateMentor(mentor.id, mentor);

    const dto: ActivateMentorDto = {
      email: 'mentor@example.com',
      code: '123456',
    };

    const result = await activateMentorService.execute(dto);

    expect(result.status).toBe(404);
    expect(result.data.message).toBe('Mentor not found');
  });
});
