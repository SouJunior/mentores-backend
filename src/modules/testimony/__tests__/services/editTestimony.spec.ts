import { Test, TestingModule } from '@nestjs/testing';
import { EditTestimonyService } from '../../services/editTestimony.service';
import { TestimonyRepository } from '../../repository/testimony.repository';
import { TestimonyEntity } from '../../entity/testimony.entity';
import { CreateTestimonyDto } from '../../dto/create-testimony.dto';
import * as formattersUtils from 'src/shared/utils/formatters.utils';

describe('EditTestimonyService', () => {
  let service: EditTestimonyService;
  let testimonyRepository: TestimonyRepository;

  beforeEach(async () => {
    // Cria mock repository
    const mockTestimonyRepository = {
      findTestimonyById: jest.fn(),
      editTestimony: jest.fn(),
    } as Partial<jest.Mocked<TestimonyRepository>>;

    // Cria testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EditTestimonyService,
        {
          provide: TestimonyRepository,
          useValue: mockTestimonyRepository,
        },
      ],
    }).compile();

    // Instancia a service e repository
    service = module.get<EditTestimonyService>(EditTestimonyService);
    testimonyRepository = module.get(TestimonyRepository);
  });

  // Testa atualizacao bem sucedida de testimony
  it('should update an existing testimony', async () => {
    // Arrange: Prepare test data
    const testimonyId = 'testimony1';
    const existingTestimony: TestimonyEntity = {
      id: testimonyId,
      userName: 'John Doe',
      description: 'Original testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/profile.jpg',
      mentor_id: 'mentor1',
    };

    const updateData: CreateTestimonyDto = {
      userName: 'John Doe Updated',
      description: 'Updated testimony description',
      role: 'Mentor',
      imageUrl: 'http://example.com/new-profile.jpg',
    };

    // Mocka métodos do repository
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(existingTestimony);

    const editTestimonySpy = jest
      .spyOn(testimonyRepository, 'editTestimony')
      .mockResolvedValue(undefined);

    // Mock dataFormatter
    const dataFormatterSpy = jest
      .spyOn(formattersUtils, 'dataFormatter')
      .mockImplementation((data) => data);

    // Act: Execute the service method
    const result = await service.execute(testimonyId, updateData);

    // Assert: Verify expected behavior
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      testimonyId,
    );
    expect(dataFormatterSpy).toHaveBeenCalledWith(updateData);
    expect(editTestimonySpy).toHaveBeenCalledWith(testimonyId, updateData);
    expect(result).toEqual({
      message: 'Testimony updated successfully',
    });

    // Clean up spy
    dataFormatterSpy.mockRestore();
  });

  // Testa atualizar testimony não existente
  it('should return message when testimony does not exist', async () => {
    // Arrange
    const nonExistentTestimonyId = 'non-existent-id';
    const updateData: CreateTestimonyDto = {
      userName: 'John Doe Updated',
      description: 'Updated testimony description',
      role: 'Mentor',
      imageUrl: 'http://example.com/new-profile.jpg',
    };

    // Configure mock to return null (testimony not found)
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(null);

    const editTestimonySpy = jest.spyOn(testimonyRepository, 'editTestimony');

    // Act
    const result = await service.execute(nonExistentTestimonyId, updateData);

    // Assert
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      nonExistentTestimonyId,
    );
    expect(editTestimonySpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: 'There are no testimony with that id.',
    });
  });

  // Test update with no changes to sensitive fields
  it('should not call dataFormatter when no changes to userName or description', async () => {
    // Arrange
    const testimonyId = 'testimony1';
    const existingTestimony: TestimonyEntity = {
      id: testimonyId,
      userName: 'John Doe',
      description: 'Original testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/profile.jpg',
      mentor_id: 'mentor1',
    };

    const updateData: CreateTestimonyDto = {
      userName: 'John Doe',
      description: 'Original testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/new-profile.jpg',
    };

    // Mock repository methods
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(existingTestimony);

    const editTestimonySpy = jest
      .spyOn(testimonyRepository, 'editTestimony')
      .mockResolvedValue(undefined);

    // Mock dataFormatter
    const dataFormatterSpy = jest
      .spyOn(formattersUtils, 'dataFormatter')
      .mockImplementation((data) => data);

    // Act
    const result = await service.execute(testimonyId, updateData);

    // Assert
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      testimonyId,
    );
    expect(dataFormatterSpy).not.toHaveBeenCalled();
    expect(editTestimonySpy).toHaveBeenCalledWith(testimonyId, updateData);
    expect(result).toEqual({
      message: 'Testimony updated successfully',
    });

    // Clean up spy
    dataFormatterSpy.mockRestore();
  });

  // Test error handling during testimony update
  it('should handle errors during testimony update', async () => {
    // Arrange
    const testimonyId = 'testimony1';
    const existingTestimony: TestimonyEntity = {
      id: testimonyId,
      userName: 'John Doe',
      description: 'Original testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/profile.jpg',
      mentor_id: 'mentor1',
    };

    const updateData: CreateTestimonyDto = {
      userName: 'John Doe Updated',
      description: 'Updated testimony description',
      role: 'Mentor',
      imageUrl: 'http://example.com/new-profile.jpg',
    };

    // Configure mocks
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(existingTestimony);

    // Simulate error during update
    const updateError = new Error('Update failed');
    const editTestimonySpy = jest
      .spyOn(testimonyRepository, 'editTestimony')
      .mockRejectedValue(updateError);

    // Mock dataFormatter
    const dataFormatterSpy = jest
      .spyOn(formattersUtils, 'dataFormatter')
      .mockImplementation((data) => data);

    // Act & Assert
    await expect(service.execute(testimonyId, updateData)).rejects.toThrow(
      updateError,
    );

    // Verify repository methods were called
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      testimonyId,
    );
    expect(dataFormatterSpy).toHaveBeenCalledWith(updateData);
    expect(editTestimonySpy).toHaveBeenCalledWith(testimonyId, updateData);

    // Clean up spies
    dataFormatterSpy.mockRestore();
  });
});
