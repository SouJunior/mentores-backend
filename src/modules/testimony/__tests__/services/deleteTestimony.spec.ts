import { Test, TestingModule } from '@nestjs/testing';
import { DeleteTestimonyService } from '../../services/deleteTestimony.service';
import { TestimonyRepository } from '../../repository/testimony.repository';
import { TestimonyEntity } from '../../entity/testimony.entity';

describe('DeleteTestimonyService', () => {
  let service: DeleteTestimonyService;
  let testimonyRepository: TestimonyRepository;

  beforeEach(async () => {
    // Cria mock repository
    const mockTestimonyRepository = {
      findTestimonyById: jest.fn(),
      deleteTestimony: jest.fn(),
    } as Partial<jest.Mocked<TestimonyRepository>>;

    // Cria testing module
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteTestimonyService,
        {
          provide: TestimonyRepository,
          useValue: mockTestimonyRepository,
        },
      ],
    }).compile();

    // Pega instancia do service e do repository
    service = module.get<DeleteTestimonyService>(DeleteTestimonyService);
    testimonyRepository = module.get(TestimonyRepository);
  });

  // Testa exclusão bem-sucedida de testimony
  it('should delete an existing testimony', async () => {
    // Arrange: Prepare test data
    const testimonyId = 'testimony1';
    const mockTestimony: TestimonyEntity = {
      id: testimonyId,
      userName: 'John Doe',
      description: 'Test testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/profile.jpg',
      mentor_id: 'mentor1',
    };

    // Configura mocks
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(mockTestimony);

    const deleteTestimonySpy = jest
      .spyOn(testimonyRepository, 'deleteTestimony')
      .mockResolvedValue(undefined);

    // Act: Executa o método da service
    const result = await service.execute(testimonyId);

    // Assert: Verifica comportamento esperado
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      testimonyId,
    );
    expect(deleteTestimonySpy).toHaveBeenCalledWith(testimonyId);
    expect(result).toEqual({
      message: 'Testimony deleted successfully',
    });
  });

  // Testa tentativa de exclusão de testimony inexistente
  it('should return message when testimony does not exist', async () => {
    // Arrange
    const nonExistentTestimonyId = 'non-existent-id';

    // Configura mock para retornar null (testimony não encontrado)
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(null);

    const deleteTestimonySpy = jest.spyOn(
      testimonyRepository,
      'deleteTestimony',
    );

    // Act
    const result = await service.execute(nonExistentTestimonyId);

    // Assert
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      nonExistentTestimonyId,
    );
    expect(deleteTestimonySpy).not.toHaveBeenCalled();
    expect(result).toEqual({
      message: 'There are no testimony with that id',
    });
  });

  // Testa tratamento de erro durante a exclusão
  it('should handle errors during testimony deletion', async () => {
    // Arrange
    const testimonyId = 'testimony1';
    const mockTestimony: TestimonyEntity = {
      id: testimonyId,
      userName: 'John Doe',
      description: 'Test testimony',
      role: 'Mentor',
      imageUrl: 'http://example.com/profile.jpg',
      mentor_id: 'mentor1',
    };

    // Configura mocks
    jest
      .spyOn(testimonyRepository, 'findTestimonyById')
      .mockResolvedValue(mockTestimony);

    // Simula erro durante a exclusão
    const deleteError = new Error('Deletion failed');
    const deleteTestimonySpy = jest
      .spyOn(testimonyRepository, 'deleteTestimony')
      .mockRejectedValue(deleteError);

    // Use console.log spy to verify error logging
    const consoleSpy = jest.spyOn(console, 'log');

    // Act & Assert
    await expect(service.execute(testimonyId)).rejects.toThrow(deleteError);

    // Verify repository methods were called
    expect(testimonyRepository.findTestimonyById).toHaveBeenCalledWith(
      testimonyId,
    );
    expect(deleteTestimonySpy).toHaveBeenCalledWith(testimonyId);

    // Clean up
    consoleSpy.mockRestore();
  });
});
