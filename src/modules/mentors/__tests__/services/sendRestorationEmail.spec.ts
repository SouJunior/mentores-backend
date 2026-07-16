import { SendRestorationEmailService } from '../../services/sendRestorationEmail.service';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { InMemoryMentorRepository } from '../../repository/inMemory/inMemoryMentor.repository';
import { MailService } from 'src/modules/mails/mail.service';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';
import { MentorRepository } from '../../repository/mentor.repository';


let sendRestorationEmailService: SendRestorationEmailService;
let inMemoryMentorRepository: InMemoryMentorRepository;
let mailServiceMock: MailService;
let generateCodeUtilMock: GenerateCodeUtil;

describe('SendRestorationEmailService', () => {
  beforeEach(() => {
    inMemoryMentorRepository = new InMemoryMentorRepository();
    generateCodeUtilMock = {
      create: vi.fn().mockReturnValue('123456'),
    } as unknown as GenerateCodeUtil;

    mailServiceMock = {
      mentorSendRestorationEmail: vi.fn(),
    } as unknown as MailService;

    sendRestorationEmailService = new SendRestorationEmailService(
      inMemoryMentorRepository as unknown as MentorRepository,
      mailServiceMock,
      generateCodeUtilMock,
    );

    inMemoryMentorRepository.createNewMentor({
      fullName: 'John Doe',
      email: 'john.doe@example.com',
      dateOfBirth: new Date('1990-01-01'),
      password: "anypass"
    });
  });

  it('Should return "Mentor not found" if the email does not exist in the repository', async () => {
    const result = await sendRestorationEmailService.execute('nonexistent@example.com');

    expect(result).toEqual({ message: 'Mentor not found' });
  });

  it('Should generate a new code and update the mentor', async () => {
    const email = 'john.doe@example.com';
    await sendRestorationEmailService.execute(email);

    const updatedMentor = await inMemoryMentorRepository.findMentorByEmail(email);

    expect(generateCodeUtilMock.create).toHaveBeenCalled();
    expect(updatedMentor?.code).toBe('123456');
  });

  it('Should call the mail service to send the restoration email', async () => {
    const email = 'john.doe@example.com';
    await sendRestorationEmailService.execute(email);

    expect(mailServiceMock.mentorSendRestorationEmail).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'john.doe@example.com',
        code: '123456',
      }),
    );
  });

  it('Should return the correct response with a success message and user data', async () => {
    const email = 'john.doe@example.com';
    const result = await sendRestorationEmailService.execute(email);

    expect(result).toEqual({
      message: 'E-mail de recuperação enviado',
      userData: {
        code: '123456',
        email: 'john.doe@example.com',
      },
    });
  });

  it('Should handle multiple calls for the same mentor by overwriting the code', async () => {
    const email = 'john.doe@example.com';

    let callCount = 0;
    generateCodeUtilMock.create = vi.fn(() => `code-${++callCount}`);

    await sendRestorationEmailService.execute(email);

    let mentorAfterFirstCall = await inMemoryMentorRepository.findMentorByEmail(email);
    expect(mentorAfterFirstCall?.code).toBe('code-1');

    await sendRestorationEmailService.execute(email);

    const mentorAfterSecondCall = await inMemoryMentorRepository.findMentorByEmail(email);
    expect(mentorAfterSecondCall?.code).toBe('code-2');

    expect(generateCodeUtilMock.create).toHaveBeenCalledTimes(2);
    expect(mailServiceMock.mentorSendRestorationEmail).toHaveBeenCalledTimes(2);
  });
});
