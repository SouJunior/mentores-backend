import { Test, TestingModule } from '@nestjs/testing';
import { TestimonyController } from '../testimony.controller';
import { CreateTestimonyService } from '../services/createTestimony.service';
import { EditTestimonyService } from '../services/editTestimony.service';
import { GetAllTestimoniesService } from '../services/getTestimonies.service';
import { DeleteTestimonyService } from '../services/deleteTestimony.service';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { MentorEntity } from '../../mentors/entities/mentor.entity';
import { GetByIdDto } from '../dto/get-by-id.dto copy';
import { TestimonyEntity } from '../entity/testimony.entity';
import { AuthGuard, PassportModule } from '@nestjs/passport';

// Mock authGuard
jest.mock('@nestjs/passport', () => {
  return {
    AuthGuard: () => jest.fn().mockImplementation(() => true),
    PassportModule: {
      register: jest.fn(),
    },
  };
});

describe('TestimonyController', () => {
  let controller: TestimonyController;
  let createTestimonyService: CreateTestimonyService;
  let editTestimonyService: EditTestimonyService;
  let getAllTestimoniesService: GetAllTestimoniesService;
  let deleteTestimonyService: DeleteTestimonyService;

  beforeEach(async () => {
    // Cria mock services
    const mockServices = {
      createTestimonyService: {
        execute: jest.fn(),
      },
      editTestimonyService: {
        execute: jest.fn(),
      },
      getAllTestimoniesService: {
        execute: jest.fn(),
      },
      deleteTestimonyService: {
        execute: jest.fn(),
      },
    };

    // cria testing module
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestimonyController],
      providers: [
        {
          provide: CreateTestimonyService,
          useValue: mockServices.createTestimonyService,
        },
        {
          provide: EditTestimonyService,
          useValue: mockServices.editTestimonyService,
        },
        {
          provide: GetAllTestimoniesService,
          useValue: mockServices.getAllTestimoniesService,
        },
        {
          provide: DeleteTestimonyService,
          useValue: mockServices.deleteTestimonyService,
        },
      ],
    }).compile();

    controller = module.get<TestimonyController>(TestimonyController);
    createTestimonyService = module.get<CreateTestimonyService>(
      CreateTestimonyService,
    );
    editTestimonyService =
      module.get<EditTestimonyService>(EditTestimonyService);
    getAllTestimoniesService = module.get<GetAllTestimoniesService>(
      GetAllTestimoniesService,
    );
    deleteTestimonyService = module.get<DeleteTestimonyService>(
      DeleteTestimonyService,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getTestimonies', () => {
    it('should return all testimonies', async () => {
      // Arrange
      const mockTestimonies: TestimonyEntity[] = [
        {
          id: '1',
          userName: 'John Doe',
          description: 'Great experience',
          role: 'Student',
          imageUrl: 'http://example.com/image1.jpg',
          mentor_id: 'mentor1',
        },
        {
          id: '2',
          userName: 'Jane Smith',
          description: 'Excellent mentor',
          role: 'Professional',
          imageUrl: 'http://example.com/image2.jpg',
          mentor_id: 'mentor2',
        },
      ];

      jest
        .spyOn(getAllTestimoniesService, 'execute')
        .mockResolvedValue(mockTestimonies);

      // Act
      const result = await controller.getTestimonies();

      // Assert
      expect(getAllTestimoniesService.execute).toHaveBeenCalled();
      expect(result).toEqual(mockTestimonies);
    });
  });

  describe('createTestimony', () => {
    it('should create a new testimony', async () => {
      // Arrange
      const createTestimonyDto: CreateTestimonyDto = {
        userName: 'John Doe',
        description: 'Great experience',
        role: 'Student',
        imageUrl: 'http://example.com/image.jpg',
      };

      const mockMentor: MentorEntity = {
        id: 'mentor1',
        fullName: 'Mentor Name',
        email: 'mentor@example.com',
        password: 'hashedPassword',
        dateOfBirth: new Date('1980-01-01'),
        specialties: ['Specialty1', 'Specialty2'],
        role: 'Mentor',
        gender: 'Male',
        aboutMe: 'About the mentor',
      };

      const expectedResponse = {
        message: 'Testimony created successfully',
      };

      jest
        .spyOn(createTestimonyService, 'execute')
        .mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.createTestimony(
        mockMentor,
        createTestimonyDto,
      );

      // Assert
      expect(createTestimonyService.execute).toHaveBeenCalledWith(
        createTestimonyDto,
        mockMentor,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('editTestimony', () => {
    it('should edit an existing testimony', async () => {
      // Arrange
      const updateTestimonyDto: CreateTestimonyDto = {
        userName: 'John Doe Updated',
        description: 'Updated experience',
        role: 'Professional',
        imageUrl: 'http://example.com/new-image.jpg',
      };

      const params: GetByIdDto = { id: 'testimony1' };

      const expectedResponse = {
        message: 'Testimony updated successfully',
      };

      jest
        .spyOn(editTestimonyService, 'execute')
        .mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.editTestimony(updateTestimonyDto, params);

      // Assert
      expect(editTestimonyService.execute).toHaveBeenCalledWith(
        params.id,
        updateTestimonyDto,
      );
      expect(result).toEqual(expectedResponse);
    });
  });

  describe('deleteTestimony', () => {
    it('should delete an existing testimony', async () => {
      // Arrange
      const params: GetByIdDto = { id: 'testimony1' };

      const expectedResponse = {
        message: 'Testimony deleted successfully',
      };

      jest
        .spyOn(deleteTestimonyService, 'execute')
        .mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.deleteTestimony(params);

      // Assert
      expect(deleteTestimonyService.execute).toHaveBeenCalledWith(params.id);
      expect(result).toEqual(expectedResponse);
    });
  });
});
