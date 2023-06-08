import { Test, TestingModule } from '@nestjs/testing';
import { Users } from '@prisma/client';
import { CreateUserDto } from '../../../../src/modules/user/dtos/create-user.dto';
import { UserEntity } from '../../../../src/modules/user/entity/user.entity';
import { UserRepository } from '../../../../src/modules/user/repository/user.repository';

describe('UserRepository', () => {
  let service: UserRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRepository],
      providers: [],
    }).compile();

    service = module.get(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createNewUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        fullName: 'Nome Completo',
        dateOfBirth: new Date('1990-01-01'),
        email: 'exemplo@example.com',
        emailConfirm: 'exemplo@example.com',
        password: 'Senha@123',
        passwordConfirmation: 'Senha@123',
      };

      const createdUser: UserEntity = {
        id: '123456789',
        fullName: 'Nome Completo',
        dateOfBirth: new Date('1990-01-01'),
        password: 'Senha@123',
        email: 'exemplo@example.com',
      };

      jest
        .spyOn(service.users, 'create')
        .mockResolvedValue(createdUser as Users);

      const result = await service.createNewUser(createUserDto);

      expect(service.users.create).toHaveBeenCalledWith({
        data: createUserDto,
      });
      expect(result).toEqual(createdUser);
    });
  });

  describe('findAllUsers', () => {
    it('should', () => {});
  });

  describe('findUserByEmail', () => {
    it('should', () => {});
  });

  describe('findUserById', () => {
    it('should', () => {});
  });

  describe('desativateUserById', () => {
    it('should', () => {});
  });

  describe('updateAccessAttempts', () => {
    it('should', () => {});
  });
});
