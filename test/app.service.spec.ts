import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from '../src/app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppService],
      providers: [],
    }).compile();

    service = module.get(AppService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('health', () => {
    it('should be able to return a "Ok" message', () => {
      const response = service.health();
      const result = {
        message: 'Ok',
      };
      expect(response).toEqual(result);
    });
  });
});
