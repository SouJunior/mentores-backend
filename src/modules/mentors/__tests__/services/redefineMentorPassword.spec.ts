import { describe, it, expect, beforeEach } from 'vitest';
import * as bcrypt from 'bcrypt';
import { RedefineMentorPasswordService } from '../../services/redefineMentorPassword.service';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MentorRepository } from '../../repository/mentor.repository';
import { ActivateMentorDto } from '../../dtos/activate-mentor.dto';
import { MentorPassConfirmationDto } from '../../dtos/mentor-pass-confirmation.dto';


let redefineMentorPasswordService: RedefineMentorPasswordService;
let inMemoryMentorRepository: InMemoryMentorRepository;

describe('RedefineMentorPasswordService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    redefineMentorPasswordService = new RedefineMentorPasswordService(
      inMemoryMentorRepository as unknown as MentorRepository,
    );

    inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: new Date('1990-01-01'),
      code: '1234',
      password: 'oldPassword',
      accessAttempt: 0,
    });
  });

  it('Should return "Mentor not found" if no mentor exists with the given email', async () => {
    const queryData: ActivateMentorDto = {
      email: 'nonexistent@example.com',
      code: '1234',
    };
    const passData: MentorPassConfirmationDto = {
      password: 'New@Password123',
      confirmPassword: 'New@Password123',
    };

    const result = await redefineMentorPasswordService.execute(queryData, passData);

    expect(result).toEqual({ message: 'Mentor not found' });
  });

  it('Should return "The code is invalid" if the code does not match', async () => {
    const queryData: ActivateMentorDto = {
      email: 'john.doe@example.com',
      code: 'wrongCode',
    };
    const passData: MentorPassConfirmationDto = {
      password: 'New@Password123',
      confirmPassword: 'New@Password123',
    };

    const result = await redefineMentorPasswordService.execute(queryData, passData);

    expect(result).toEqual({ message: 'The code is invalid' });
  });

  it("Should return \"The passwords don't match\" if the password and confirmation do not match", async () => {
    const queryData: ActivateMentorDto = {
      email: 'john.doe@example.com',
      code: '1234',
    };
    const passData: MentorPassConfirmationDto = {
      password: 'New@Password123',
      confirmPassword: 'Different@Password123',
    };

    const result = await redefineMentorPasswordService.execute(queryData, passData);

    expect(result).toEqual({ message: "The passwords don't match" });
  });

  it('Should hash and update the password and clear the code when successful', async () => {
    const queryData: ActivateMentorDto = {
      email: 'john.doe@example.com',
      code: '1234',
    };
    const passData: MentorPassConfirmationDto = {
      password: 'New@Password123',
      confirmPassword: 'New@Password123',
    };

    const result = await redefineMentorPasswordService.execute(queryData, passData);

    const mentor = await inMemoryMentorRepository.findMentorByEmail(
      queryData.email,
    );

    expect(result).toEqual({ message: 'The account was restored sucessfully' });
    expect(mentor?.password).not.toBe('New@Password123');
    expect(await bcrypt.compare('New@Password123', mentor?.password || '')).toBe(true);
    expect(mentor?.code).toBeNull();
    expect(mentor?.accessAttempt).toBe(0);
  });

  it('Should not update the password if mentor is not found', async () => {
    const queryData: ActivateMentorDto = {
      email: 'nonexistent@example.com',
      code: '1234',
    };
    const passData: MentorPassConfirmationDto = {
      password: 'New@Password123',
      confirmPassword: 'New@Password123',
    };

    const result = await redefineMentorPasswordService.execute(queryData, passData);

    expect(result).toEqual({ message: 'Mentor not found' });
  });
});