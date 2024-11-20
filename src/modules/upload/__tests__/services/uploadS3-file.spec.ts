import { FileUploadService } from '../../upload.service';

jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      upload: jest.fn((params, callback) => {
        callback(null, {
          Location: 'https://s3.amazonaws.com/bucket/file.txt',
        });
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

  it('should upload file to S3 successfully', async () => {
    const file = Buffer.from('test file content');
    const bucket = 'my-test-bucket';
    const name = 12345;

    const result = await fileUploadService.uploadS3(
      file,
      bucket,
      name,
      'text/plain',
    );

    expect(fileUploadService.s3.upload).toHaveBeenCalledWith(
      {
        Bucket: bucket,
        Key: expect.any(String),
        Body: file,
        ContentType: 'text/plain',
      },
      expect.any(Function),
    );

    expect(result).toEqual({
      Location: 'https://s3.amazonaws.com/bucket/file.txt',
    });
  });
});
