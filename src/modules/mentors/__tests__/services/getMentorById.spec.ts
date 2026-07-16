import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { GetMentorByIdService } from '../../services/getMentorById.service';
import { MentorRepository } from '../../repository/mentor.repository';

let inMemoryMentorRepository: InMemoryMentorRepository;
let getMentorByIdService: GetMentorByIdService;

describe('GetMentorByIdService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    getMentorByIdService = new GetMentorByIdService(inMemoryMentorRepository as unknown as MentorRepository);
  });

  it('Should return a mentor when a valid ID is provided', async () => {

    const createdMentor = await inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      dateOfBirth: new Date('1985-05-15'),
      email: 'johndoe@example.com',
      password: "anypass"
    });

    const result = await getMentorByIdService.execute(createdMentor.id);

    expect(result.status).toBe(200);
    expect(result.data).toEqual({
      id: createdMentor.id,
      fullName: 'John Doe',
      dateOfBirth: expect.any(Date),
      email: 'johndoe@example.com',
      registerComplete: false,
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      deleted: false,
    });
  });

  it('Should return a 404 error when a mentor with the given ID is not found', async () => {

    const result = await getMentorByIdService.execute('non-existent-id');

    expect(result.status).toBe(404);
    expect(result.data).toEqual({ message: 'Mentor not found' });
  });
});
