import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { MailModule } from '../mails/mail.module';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from './user.repository';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { FileUploadService } from '../upload/upload.service';
import { ActivateUserService } from './services/activateUser.service';
import { CreateUserService } from './services/createUser.service';
import { DesactivateLoggedUserService } from './services/deactivateLoggedUser.service';
import { GetUserByIdService } from './services/findUserById.service';
import { GetAllUsersService } from './services/getAllUsers.service';
import { RedefineUserPasswordService } from './services/redefineUserPassword.service';
import { SendRestorationEmailService } from './services/sendRestorationEmail.service';
import { UpdateUserService } from './services/updateUser.service';
import { UploadProfileImageService } from './services/uploadProfileImage.service';
import { NorthFlankTestMethod } from './services/northFlankTest.service';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UserController],
  providers: [
    ActivateUserService,
    CreateUserService,
    DesactivateLoggedUserService,
    GetUserByIdService,
    GetAllUsersService,
    RedefineUserPasswordService,
    SendRestorationEmailService,
    UpdateUserService,
    UploadProfileImageService,
    UserRepository,
    GenerateCodeUtil,
    FileUploadService,
    NorthFlankTestMethod
  ],
  exports: [UserRepository],
})
export class UserModule {}
