import { InternalServerErrorException } from '@nestjs/common';
import { FileUploadService } from '../../upload.service';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn().mockImplementation(() => ({
      deleteObject: jest.fn(),
    })),
  };
});

describe('FileUploadService', () => {
  let fileUploadService: FileUploadService;
  let mockDeleteObject: jest.Mock;

  beforeEach(() => {
    fileUploadService = new FileUploadService();
    mockDeleteObject = (fileUploadService as any).s3.deleteObject;
  });

  it('should throw an InternalServerErrorException on error', async () => {
    mockDeleteObject.mockReturnValueOnce({
      promise: jest.fn().mockRejectedValue(new Error('Some error')),
    });

    await expect(fileUploadService.deleteFile('some-file-name')).rejects.toThrowError(
      InternalServerErrorException,
    );

  });
});
