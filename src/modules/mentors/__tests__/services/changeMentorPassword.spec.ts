import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as bcrypt from 'bcrypt';
import { ChangeMentorPasswordService } from '../../services/changeMentorPassword.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';
import { MentorEntity } from '../../entities/mentor.entity';
import { MentorChangePassDto } from '../../dtos/mentor-change-pass.dto';


let changeMentorPasswordService: ChangeMentorPasswordService;
let inMemoryMentorRepository: InMemoryMentorRepository;

describe('ChangeMentorPasswordService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    changeMentorPasswordService = new ChangeMentorPasswordService(
      inMemoryMentorRepository as unknown as MentorRepository,
    );
    vi.restoreAllMocks();
  });

  it('Should change the mentor password successfully', async () => {
    const mentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Test Mentor',
      dateOfBirth: new Date('1990-01-01'),
      password: await bcrypt.hash('OldPass@123', 10),
    });

    const dto: MentorChangePassDto = {
      oldPassword: 'OldPass@123',
      password: 'NewPass@123',
      confirmPassword: 'NewPass@123',
    };

    const result = await changeMentorPasswordService.execute(mentor, dto);

    expect(result.status).toBe(200);
    expect(result.message).toBe('Password changed successfully');

    const updatedMentor = await inMemoryMentorRepository.findFullMentorById(
      mentor.id,
    );
    const isPasswordUpdated = await bcrypt.compare(
      dto.password,
      updatedMentor.password,
    );

    expect(isPasswordUpdated).toBe(true);
  });

  it('Should return an error when the old password is incorrect', async () => {
    const mentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Test Mentor',
      dateOfBirth: new Date('1990-01-01'),
      password: await bcrypt.hash('OldPass@123', 10),
    });

    const dto: MentorChangePassDto = {
      oldPassword: 'WrongOldPass@123',
      password: 'NewPass@123',
      confirmPassword: 'NewPass@123',
    };

    const result = await changeMentorPasswordService.execute(mentor, dto);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Incorrect old password');

    const unchangedMentor = await inMemoryMentorRepository.findFullMentorById(
      mentor.id,
    );
    const isPasswordUpdated = await bcrypt.compare(
      dto.password,
      unchangedMentor.password,
    );

    expect(isPasswordUpdated).toBe(false);
  });

  it('Should return an error when the database update fails', async () => {
    const mentor: MentorEntity = await inMemoryMentorRepository.createNewMentor({
      email: 'mentor@example.com',
      fullName: 'Test Mentor',
      dateOfBirth: new Date('1990-01-01'),
      password: await bcrypt.hash('OldPass@123', 10),
    });

    const dto: MentorChangePassDto = {
      oldPassword: 'OldPass@123',
      password: 'NewPass@123',
      confirmPassword: 'NewPass@123',
    };

    vi.spyOn(inMemoryMentorRepository, 'updateMentor').mockImplementation(() => {
      throw new Error('Database error');
    });

    const result = await changeMentorPasswordService.execute(mentor, dto);

    expect(result.status).toBe(400);
    expect(result.message).toBe('Something went wrong in the database');
  });
});
