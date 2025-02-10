import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { GetMentorByNameAndRoleService } from '../../services/getMentorByNameAndRole.service';
import { MentorRepository } from '../../repository/mentor.repository';


let inMemoryMentorRepository: InMemoryMentorRepository;
let getMentorByNameAndRoleService: GetMentorByNameAndRoleService;

describe('GetMentorByNameAndRoleService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    getMentorByNameAndRoleService = new GetMentorByNameAndRoleService(
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
      specialties: ['Backend', 'DevOps'],
      password: "anypass"
    });
  });

  it('Should return mentors matching the fullName', async () => {

    const result = await getMentorByNameAndRoleService.execute('John');

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'John Doe' }),
        expect.objectContaining({ fullName: 'Jack Johnson' }),
      ]),
    );
  });

  it('Should return mentors matching the specialty', async () => {

    const result = await getMentorByNameAndRoleService.execute(undefined, 'Backend');

    expect(result).toHaveLength(2);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'John Doe' }),
        expect.objectContaining({ fullName: 'Jack Johnson' }),
      ]),
    );
  });

  it('Should return mentors matching both fullName and specialty', async () => {

    const result = await getMentorByNameAndRoleService.execute('Jack', 'Backend');

    expect(result).toHaveLength(1);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'Jack Johnson' }),
      ]),
    );
  });

  it('Should return an empty array when no mentors match the criteria', async () => {
 
    const result = await getMentorByNameAndRoleService.execute('Nonexistent', 'Nonexistent');

    expect(result).toHaveLength(0);
  });

  it('Should return all mentors when no filters are provided', async () => {
  
    const result = await getMentorByNameAndRoleService.execute();

    expect(result).toHaveLength(3);
    expect(result).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fullName: 'John Doe' }),
        expect.objectContaining({ fullName: 'Jane Smith' }),
        expect.objectContaining({ fullName: 'Jack Johnson' }),
      ]),
    );
  });
});
