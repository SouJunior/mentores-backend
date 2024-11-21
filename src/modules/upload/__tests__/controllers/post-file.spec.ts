import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from '../../upload.controller';
import { FileUploadService } from '../../upload.service';
import { AuthGuard } from '@nestjs/passport';

describe('UploadController', () => {
  let uploadController: UploadController;
  let fileUploadService: FileUploadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadController],
      providers: [
        {
          provide: FileUploadService,
          useValue: {
            upload: jest.fn(),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard('default'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    uploadController = module.get<UploadController>(UploadController);
    fileUploadService = module.get<FileUploadService>(FileUploadService);
  });

  it('should return the file location on successful upload', async () => {
    const mockFile = { buffer: Buffer.from('test file content') };
    const mockResponse = {
      Location: 'https://s3.amazonaws.com/bucket/file.txt',
      ETag: '12345abcde',
      key: 'file.txt',
      VersionId: '123456789',
      Bucket: 'my-bucket',
    };

    jest.spyOn(fileUploadService, 'upload').mockResolvedValue(mockResponse);

    const result = await uploadController.upload(mockFile);

    expect(fileUploadService.upload).toHaveBeenCalledWith(mockFile);
    expect(result).toBe(mockResponse.Location);
  });
});
