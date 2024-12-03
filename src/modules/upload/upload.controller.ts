import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { FileUploadService } from './upload.service';
import { UploadSwagger } from '../../shared/Swagger/decorators/upload/upload.swagger.decorator';

@ApiTags('Upload')
@ApiBearerAuth()
@UseGuards(AuthGuard())
@Controller('upload')
export class UploadController {
  constructor(private fileUploadService: FileUploadService) {}

  @UploadSwagger()
  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file) {
    const response = await this.fileUploadService.upload(file);

    if (response.Location) {
      return response.Location;
    }

    return response;
  }
}
