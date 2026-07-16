import { describe, it, expect, beforeEach } from 'vitest';
import { ListAllRegisteredMentorsService } from '../../services/listAllRegisteredMentors.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';
import { makeMentor } from 'src/test/factories/make-mentor';

let inMemoryMentorRepository: InMemoryMentorRepository;
let listAllRegisteredMentorsService: ListAllRegisteredMentorsService;

describe('ListAllRegisteredMentorsService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    listAllRegisteredMentorsService = new ListAllRegisteredMentorsService(
      inMemoryMentorRepository as unknown as MentorRepository,
    );

    inMemoryMentorRepository.createNewMentor(
      makeMentor({ fullName: 'John Doe', registerComplete: true }),
    );

    inMemoryMentorRepository.createNewMentor(
      makeMentor({ fullName: 'Jane Smith', registerComplete: false }),
    );

    inMemoryMentorRepository.createNewMentor(
      makeMentor({ fullName: 'Jack Johnson', registerComplete: true }),
    );
  });

  it('Should return a list of all registered mentors', async () => {
    const result = await listAllRegisteredMentorsService.execute();

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'John Doe', registerComplete: true }),
        expect.objectContaining({ fullName: 'Jack Johnson', registerComplete: true }),
      ]),
    );
  });

  it('Should return an empty list when no registered mentors exist', async () => {
    inMemoryMentorRepository.mentors.forEach(
      (mentor) => (mentor.registerComplete = false),
    );

    const result = await listAllRegisteredMentorsService.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });

  it('Should not include unregistered mentors in the result', async () => {
    const result = await listAllRegisteredMentorsService.execute();

    result.forEach((mentor) => {
      expect(mentor.registerComplete).toBe(true);
    });
  });
});
