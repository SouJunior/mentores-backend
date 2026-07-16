import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UpdateMentorService } from '../../services/updateMentor.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';
import { UpdateMentorDto } from '../../dtos/update-mentor.dto';
import { MentorEntity } from '../../entities/mentor.entity';


describe('UpdateMentorService', () => {
  let updateMentorService: UpdateMentorService;
  let inMemoryMentorRepository: InMemoryMentorRepository;

  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    updateMentorService = new UpdateMentorService(inMemoryMentorRepository as unknown as MentorRepository);
  });

  it('Should return 404 if the mentor is not found', async () => {
    const nonExistentMentorId = '999';
    const updateData: UpdateMentorDto = { fullName: 'Updated Name' };

    const result = await updateMentorService.execute(nonExistentMentorId, updateData);

    expect(result.status).toBe(404);
    expect(result.message).toBe('There are no mentor with that id');
  });

  it('Should update the mentor and set "registerComplete" to true if not provided', async () => {
    const newMentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: new Date(),
      password: "anypass"
    });

    const updateData: UpdateMentorDto = { fullName: 'Updated John Doe' };

    const result = await updateMentorService.execute(newMentor.id, updateData);
    const updatedMentor = await inMemoryMentorRepository.findMentorById(newMentor.id);

    expect(result.status).toBe(200);
    expect(result.message).toBe('The mentor was updated successfully');
    expect(updatedMentor?.fullName).toBe('Updated John Doe');
    expect(updatedMentor?.registerComplete).toBe(true);
  });

  it('Should retain "registerComplete" as true if it is already set', async () => {
    const newMentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: new Date(),
      password: "anypass"
    });

    await inMemoryMentorRepository.updateMentor(newMentor.id!, {
      registerComplete: true,
    });

    const updateData: UpdateMentorDto = { fullName: 'Updated John Doe' };

    const result = await updateMentorService.execute(newMentor.id, updateData);
    const updatedMentor = await inMemoryMentorRepository.findMentorById(newMentor.id);

    expect(result.status).toBe(200);
    expect(result.message).toBe('The mentor was updated successfully');
    expect(updatedMentor?.registerComplete).toBe(true);
  });

  it('Should return 400 if an error occurs during the update', async () => {
    const newMentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: new Date(),
      password: "anypass"
    });

    vi.spyOn(inMemoryMentorRepository, 'updateMentor').mockRejectedValue(new Error('Database error'));

    const updateData: UpdateMentorDto = { fullName: 'Updated John Doe' };

    const result = await updateMentorService.execute(newMentor.id, updateData);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Something went wrong in the database');
  });
});
