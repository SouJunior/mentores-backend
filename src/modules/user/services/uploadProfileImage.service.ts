import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user.repository';
import { UpdateUserDto } from '../dto/update-user.dto';
import { CustomBadRequestException } from 'src/shared/exceptions/badRequest.exception';
import { FileUploadService } from '../../upload/upload.service';

@Injectable()
export class UploadProfileImageService {
  constructor(
    private userRepository: UserRepository,
    private fileUploadService: FileUploadService,
  ) {}

  async execute(id: string, user: UpdateUserDto, file) {
    user.profileKey = 'genericUserImage';
    if (file && !user.profileKey) {
      throw new CustomBadRequestException(
        'profileKey is required when file is sent',
      );
    }

    if (file) {
      await this.fileUploadService.deleteFile(user.profileKey);
      const { Location, key } = await this.fileUploadService.upload(file);
      user.profile = Location;
      user.profileKey = key;

      await this.userRepository.updateUserUrl(id, user.profile);
    }

    delete user.file;

    return {
      message: 'The profile image was updated succesfully',
      status: 200,
    };
  }
}
