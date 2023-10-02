import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MailModule } from '../mails/mail.module';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from './user.repository';
import { GenerateCodeUtil } from 'src/shared/utils/generate-code.util';
import { FileUploadService } from '../upload/upload.service';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UserController],
  providers: [UserService, UserRepository, GenerateCodeUtil, FileUploadService],
  exports: [UserRepository]
})
export class UserModule {}
