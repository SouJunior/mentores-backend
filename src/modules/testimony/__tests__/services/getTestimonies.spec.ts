import { Test, TestingModule } from '@nestjs/testing';
import { GetAllTestimoniesService } from '../../services/getTestimonies.service';
import { TestimonyEntity } from '../../entity/testimony.entity';
import { TestimonyRepository } from '../../repository/testimony.repository';
import { MentorRepository } from 'src/modules/mentors/repository/mentor.repository';
import { MentorEntity } from 'src/modules/mentors/entities/mentor.entity';

describe('GetAllTestimoniesService', () => {
  // Inicializa o mocka das dependencias
  let service: GetAllTestimoniesService;
  let testimonyRepository: TestimonyRepository;
  let mentorRepository: MentorRepository;

  beforeEach(async () => {
    // cria mock repositories para o Testimony e para o Mentors
    const mockTestimonyRepository = {
      findAlltestimony: jest.fn(),
      editTestimony: jest.fn(),
    } as Partial<jest.Mocked<TestimonyRepository>>;

    const mockMentorRepository = {
      findAllMentors: jest.fn(),
    } as Partial<jest.Mocked<MentorRepository>>;

    // modulo de testes
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetAllTestimoniesService,
        {
          provide: TestimonyRepository,
          useValue: mockTestimonyRepository,
        },
        {
          provide: MentorRepository,
          useValue: mockMentorRepository,
        },
      ],
    }).compile();

    // Instancia as dependências
    service = module.get<GetAllTestimoniesService>(GetAllTestimoniesService);
    testimonyRepository = module.get(TestimonyRepository);
    mentorRepository = module.get(MentorRepository);
  });

  // test # 1 -> Pegar todas as testimonies, verifica se bate com o id do mentor, atualiza
  // a testimony com a info do mentor, retorna a testimony atualizada.

  it('should retrieve and update testimonies with mentor information', async () => {
    // Arrange
    const mockTestimonies: TestimonyEntity[] = [
      {
        id: '1',
        mentor_id: 'mentor1',
        imageUrl: '',
        role: '',
        userName: '',
        description: 'Testimony description',
      },
    ];

    const mockMentors: MentorEntity[] = [
      {
        id: 'mentor1',
        fullName: 'John Doe',
        profile: 'profile-url',
        specialties: ['JavaScript', 'React'],
        dateOfBirth: new Date(),
        password: 'password',
        email: 'john.doe@example.com',
        role: 'mentor',
        createdAt: new Date(),
        updatedAt: new Date(),
        gender: 'Male',
        aboutMe: 'A great Mentor',
      },
    ];

    jest
      .spyOn(testimonyRepository, 'findAlltestimony')
      .mockResolvedValue(mockTestimonies);

    jest
      .spyOn(mentorRepository, 'findAllMentors')
      .mockResolvedValue(mockMentors);

    jest
      .spyOn(testimonyRepository, 'editTestimony')
      .mockResolvedValue(undefined);

    // Act
    const result = await service.execute();

    // Assert
    expect(testimonyRepository.findAlltestimony).toHaveBeenCalled();
    expect(mentorRepository.findAllMentors).toHaveBeenCalled();
    expect(testimonyRepository.editTestimony).toHaveBeenCalledWith('1', {
      id: '1',
      mentor_id: 'mentor1',
      imageUrl: 'profile-url',
      role: 'JavaScript,React',
      userName: 'John Doe',
      description: 'Testimony description',
    });
    expect(result).toEqual([
      {
        id: '1',
        mentor_id: 'mentor1',
        imageUrl: 'profile-url',
        role: 'JavaScript,React',
        userName: 'John Doe',
        description: 'Testimony description',
      },
    ]);
  });
});

// TESTE ANTIGOS
// describe('Get Testimonies Tests', () => {
//   // variavel de servico, do tipo servico
//   let service: GetAllTestimoniesService;
//   let testimonyRepository: jest.Mocked<TestimonyRepository>

//   // vai rodar antes de cada teste
//   beforeEach(() => {
//     service = {
//       execute: jest.fn(),
//     } as any;
//   });

//   describe('execute', () => {
//     it('should run the service', async () => {
//       const testimonies: TestimonyEntity[] = [
//         {
//           userName: 'teste',
//           role: 'teste role',
//           description: 'teste description',
//         },
//       ];

//       jest.spyOn(service, 'execute').mockResolvedValue(testimonies);
//       const result = await service.execute();

//       // espera-se que o resultado seja igual a lista de testimonies.
//       expect(result).toEqual(testimonies);
//     });
//   });
// });
