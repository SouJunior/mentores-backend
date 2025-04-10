import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { ListAllMentorsService } from '../../services/listAllMentors.service';
import { MentorRepository } from '../../repository/mentor.repository';


let inMemoryMentorRepository: InMemoryMentorRepository;
let listAllMentorsService: ListAllMentorsService;

describe('ListAllMentorsService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    listAllMentorsService = new ListAllMentorsService(
      inMemoryMentorRepository as unknown as MentorRepository,
    );

    inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      dateOfBirth: new Date('1990-01-01'),
      email: 'john.doe@example.com',
      specialties: ['Backend'],
      password: "anypass"
    });
    inMemoryMentorRepository.createNewMentor({
      fullName: 'Jane Smith',
      dateOfBirth: new Date('1985-05-15'),
      email: 'jane.smith@example.com',
      specialties: ['Frontend'],
      password: "anypass"
    });
    inMemoryMentorRepository.createNewMentor({
      fullName: 'Jack Johnson',
      dateOfBirth: new Date('1980-10-10'),
      email: 'jack.johnson@example.com',
      specialties: ['DevOps'],
      password: "anypass"
    });
  });

  it('Should return a list of all mentors', async () => {
    const result = await listAllMentorsService.execute();

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'John Doe' }),
        expect.objectContaining({ fullName: 'Jane Smith' }),
        expect.objectContaining({ fullName: 'Jack Johnson' }),
      ]),
    );
  });

  it('Should return an empty list when no mentors exist', async () => {
    inMemoryMentorRepository.mentors = [];

    const result = await listAllMentorsService.execute();

    expect(result).toHaveLength(0);
    expect(result).toEqual([]);
  });
});
