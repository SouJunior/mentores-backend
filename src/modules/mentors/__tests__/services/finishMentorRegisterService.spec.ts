import { describe, it, expect, beforeEach } from 'vitest';
import { FinishMentorRegisterService } from '../../services/finishMentorRegisterService.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';

let inMemoryMentorRepository: InMemoryMentorRepository;
let finishMentorRegisterService: FinishMentorRegisterService;

describe('FinishMentorRegisterService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    finishMentorRegisterService = new FinishMentorRegisterService(inMemoryMentorRepository as unknown as MentorRepository);
  });

  it('Should mark a mentor registration as complete if not already completed', async () => {
    const mentor = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Password@123',
    });

    const response = await finishMentorRegisterService.execute(mentor.id);

    const updatedMentor = await inMemoryMentorRepository.findMentorById(mentor.id);

    expect(response.message).toBe('The registration was declared as completed.');
    expect(updatedMentor?.registerComplete).toBe(true);
  });

  it('Should return a message if the registration is already complete', async () => {
    const mentor = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Mentor Test',
      dateOfBirth: new Date('1990-01-01'),
      password: 'Password@123',
    });

    await inMemoryMentorRepository.registerCompleteToggle(mentor.id);

    const response = await finishMentorRegisterService.execute(mentor.id);

    expect(response.message).toBe('The user has already finished his registration');
  });
});
