import { Logger } from "@nestjs/common";
import { FileUploadService } from "../../upload.service";

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      upload: jest.fn((params, callback) => {
        callback(null, { Location: 'https://s3.amazonaws.com/bucket/file.txt' });
      }),
    })),
  };
});

describe('FileUploadService', () => {
  let fileUploadService;

  beforeEach(() => {
    fileUploadService = new FileUploadService();
    fileUploadService.s3 = new (require('aws-sdk').S3)();
  });

  it('should handle upload error', async () => {
    fileUploadService.s3.upload.mockImplementationOnce((params, callback) => {
      callback({ message: 'Upload failed' }, null);
    });

    const file = Buffer.from('test file content');
    const bucket = 'my-test-bucket';
    const name = 12345;
    jest.spyOn(Logger, 'error').mockImplementation(() => {
      });

    await expect(fileUploadService.uploadS3(file, bucket, name, 'text/plain')).rejects.toEqual('Upload failed');

    expect(fileUploadService.s3.upload).toHaveBeenCalled();
  });
});
