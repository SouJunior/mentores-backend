import { Test, TestingModule } from '@nestjs/testing';
import { DeactivateLoggedMentorService } from '../../services/deactivateLoggedMentor.service';
import { MentorRepository } from '../../repository/mentor.repository';
import { MailService } from 'src/modules/mails/mail.service';
import { MentorEntity } from '../../entities/mentor.entity';
import { Logger } from '@nestjs/common';

describe('DeactivateLoggedMentorService', () => {
  let service: DeactivateLoggedMentorService;
  let mentorRepository: MentorRepository;
  let mailService: MailService;

  beforeEach(async () => {
    const mockServices = {
      mentorRepository: {
        findMentorById: jest.fn(),
        deactivateMentorById: jest.fn(),
        findDeactivatedMentors: jest.fn(),
      },
      mailService: {
        mentorSendFirstDeactivationNotice: jest.fn(),
        mentorSendSecondDeactivationNotice: jest.fn(),
        mentorSendThirdDeactivationNotice: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeactivateLoggedMentorService,
        {
          provide: MentorRepository,
          useValue: mockServices.mentorRepository,
        },
        {
          provide: MailService,
          useValue: mockServices.mailService,
        },
      ],
    }).compile();

    service = module.get<DeactivateLoggedMentorService>(
      DeactivateLoggedMentorService,
    );
    mentorRepository = module.get<MentorRepository>(MentorRepository);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('handleDeactivationNotifications', () => {
    it('should process notifications for deactivated mentors', async () => {
      // Arrange
      const mockDeactivatedMentors: MentorEntity[] = [
        {
          id: 'mentor1',
          fullName: 'Test Mentor',
          email: 'test@example.com',
          password: 'hashedPassword',
          dateOfBirth: new Date('1990-01-01'),
          specialties: ['Specialty1'],
          role: 'Mentor',
          gender: 'Male',
          aboutMe: 'About me',
          updatedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
        },
      ];

      jest
        .spyOn(mentorRepository, 'findDeactivatedMentors')
        .mockResolvedValue(mockDeactivatedMentors);
      jest
        .spyOn(mailService, 'mentorSendSecondDeactivationNotice')
        .mockResolvedValue(undefined);

      // Act
      await service.handleDeactivationNotifications();

      // Assert
      expect(mentorRepository.findDeactivatedMentors).toHaveBeenCalled();
      expect(
        mailService.mentorSendSecondDeactivationNotice,
      ).toHaveBeenCalledWith(mockDeactivatedMentors[0]);
    });
  });
});
