import { UpdateMentorDto } from '../dtos/update-mentor.dto';
import { MentorRepository } from '../repository/mentor.repository';
import { CustomBadRequestException } from '../../../shared/exceptions/badRequest.exception';
import { FileUploadService } from '../../upload/upload.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UploadProfileImageService {
  constructor(
    private mentorRepository: MentorRepository,
    private fileUploadService: FileUploadService,
  ) {}

  async execute(id: string, mentor: UpdateMentorDto, file) {
    mentor.profileKey = 'genericImage';
    if (file && !mentor.profileKey) {
      throw new CustomBadRequestException(
        'profileKey is required when file is sent',
      );
    }

    if (file) {
      await this.fileUploadService.deleteFile(mentor.profileKey);
      const { Location, key } = await this.fileUploadService.upload(file);
      mentor.profile = Location;
      mentor.profileKey = key;

      await this.mentorRepository.updateMentorUrl(id, mentor.profile);
    }

    delete mentor.file;

    return {
      message: 'The profile image was updated succesfully',
      status: 200,
    };
  }
}
