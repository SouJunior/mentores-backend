import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailModule } from '../mails/mail.module';
import { MentorController } from './mentor.controller';
import { MentorService } from './services/finishMentorRegisterService.service';
import { MentorRepository } from './repository/mentor.repository';
import { FileUploadService } from '../upload/upload.service';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [MentorController],
  providers: [MentorService, MentorRepository, GenerateCodeUtil, FileUploadService],
  exports: [MentorRepository],
})
export class MentorModule {}
