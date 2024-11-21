import { Test, TestingModule } from '@nestjs/testing';
import { CreateTestimonyService } from '../../services/createTestimony.service';
import { TestimonyRepository } from '../../repository/testimony.repository';
import { CreateTestimonyDto } from '../../dto/create-testimony.dto';
import { MentorEntity } from 'src/modules/mentors/entities/mentor.entity';

describe('CreateTestimonyService', () => {
  let service: CreateTestimonyService;
  let testimonyRepository: TestimonyRepository;

  beforeEach(async () => {
    // Create mock repository
    const mockTestimonyRepository = {
      createNewTestimony: jest.fn(),
    } as Partial<jest.Mocked<TestimonyRepository>>;

    // Create testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateTestimonyService,
        {
          provide: TestimonyRepository,
          useValue: mockTestimonyRepository,
        },
      ],
    }).compile();

    // Get service and repository instances
    service = module.get<CreateTestimonyService>(CreateTestimonyService);
    testimonyRepository = module.get(TestimonyRepository);
  });

  // Test successful testimony creation
  it('should create a testimony with mentor data', async () => {
    // Arrange: Prepare test data
    const mentorData: MentorEntity = {
      id: 'mentor1',
      fullName: 'John Doe',
      profile: 'http://example.com/profile.jpg',
      specialties: ['JavaScript', 'React'],
      dateOfBirth: new Date(),
      password: 'password',
      email: 'john@example.com',
      role: 'mentor',
      createdAt: new Date(),
      updatedAt: new Date(),
      gender: 'Male',
      aboutMe: 'Test mentor',
    };

    const createTestimonyDto: CreateTestimonyDto = {
      description: 'Test testimony description',
      userName: mentorData.fullName,
      role: mentorData.specialties.join(','),
      imageUrl: mentorData.profile,
    };

    // Spy on repository method
    jest
      .spyOn(testimonyRepository, 'createNewTestimony')
      .mockResolvedValue(undefined);

    // Act: Execute the service method
    const result = await service.execute(createTestimonyDto, mentorData);

    // Assert: Verify the expected behavior
    expect(testimonyRepository.createNewTestimony).toHaveBeenCalledWith(
      {
        ...createTestimonyDto,
        userName: mentorData.fullName,
        role: 'JavaScript,React',
        imageUrl: mentorData.profile,
      },
      mentorData.id,
    );

    expect(result).toEqual({
      message: 'Testimony created successfully',
    });
  });

  // Test error handling
  it('should handle errors during testimony creation', async () => {
    // Arrange
    const createTestimonyDto: CreateTestimonyDto = {
      description: 'Test testimony description',
      userName: '',
      role: '',
      imageUrl: '',
    };

    const mentorData: MentorEntity = {
      id: 'mentor1',
      fullName: 'John Doe',
      profile: 'http://example.com/profile.jpg',
      specialties: ['JavaScript', 'React'],
      // Add other required mentor properties
      dateOfBirth: new Date(),
      password: 'password',
      email: 'john@example.com',
      role: 'mentor',
      createdAt: new Date(),
      updatedAt: new Date(),
      gender: 'Male',
      aboutMe: 'Test mentor',
    };

    // Simulate repository error
    const mockError = new Error('Repository creation failed');
    jest
      .spyOn(testimonyRepository, 'createNewTestimony')
      .mockRejectedValue(mockError);

    // Use console.log spy to verify error logging
    const consoleSpy = jest.spyOn(console, 'log');

    // Act & Assert
    const result = await service.execute(createTestimonyDto, mentorData);

    // Verify error was logged
    expect(consoleSpy).toHaveBeenCalledWith(mockError);

    // Verify result is still returned
    expect(result).toEqual({
      message: 'Testimony created successfully',
    });

    // Clean up
    consoleSpy.mockRestore();
  });
});
