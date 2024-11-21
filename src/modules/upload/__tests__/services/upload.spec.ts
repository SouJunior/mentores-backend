import { FileUploadService } from '../../upload.service';

describe('FileUploadService', () => {
  let uploadService: FileUploadService;

  beforeEach(() => {
    uploadService = new FileUploadService();
  });

  it('Should upload the file to AWS S3 and return its data', async () => {
    const file = {
      buffer: 'buffer',
      originalname: 'example-image.jpg',
    };

    const mockS3Response = {
      ETag: '"some-etag-value"',
      Location: 'https://bucket-name.s3.amazonaws.com/test-image.jpg',
      key: 'test-image.jpg',
      Bucket: 'bucket-name',
      VersionId: 'version-id',
    };

    jest.spyOn(uploadService, 'uploadS3').mockResolvedValue(mockS3Response);

    const result = await uploadService.upload(file, 'image/jpeg');

    expect(uploadService.uploadS3).toHaveBeenCalledWith(
      file.buffer,
      process.env.AWS_S3_BUCKET_NAME,
      file.originalname,
      'image/jpeg',
    );

    expect(result).toEqual(mockS3Response);
  });
});
