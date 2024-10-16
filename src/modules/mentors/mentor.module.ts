import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailModule } from '../mails/mail.module';
import { MentorController } from './mentor.controller';
import { MentorRepository } from './repository/mentor.repository';
import { FileUploadService } from '../upload/upload.service';
import { CreateMentorService } from './services/createMentor.service';
import { UpdateMentorService } from './services/updateMentor.service';
import { ListAllMentorsService } from './services/listAllMentors.service';
import { GetMentorByIdService } from './services/getMentorById.service';
import { GetMentorByNameAndRoleService } from './services/getMentorByNameAndRole.service';
import { ActivateMentorService } from './services/activateMentor.service';
import { ChangeMentorPasswordService } from './services/changeMentorPassword.service';
import { DesactivateLoggedMentorService } from './services/deactivateLoggedMentor.service';
import { FinishMentorRegisterService } from './services/finishMentorRegisterService.service';
import { RedefineMentorPasswordService } from './services/redefineMentorPassword.service';
import { SendRestorationEmailService } from './services/sendRestorationEmail.service';
import { UploadProfileImageService } from './services/uploadProfileImage.service';
import { FetchSchedulesService } from './services/fetch-schedules.service';
import { RefreshTokenService } from '../auth/services/refresh-token.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [MentorController],
  providers: [
    CreateMentorService,
    UpdateMentorService,
    ListAllMentorsService,
    GetMentorByIdService,
    GetMentorByNameAndRoleService,
    ActivateMentorService,
    ChangeMentorPasswordService,
    DesactivateLoggedMentorService,
    FinishMentorRegisterService,
    RedefineMentorPasswordService,
    SendRestorationEmailService,
    UploadProfileImageService,
    MentorRepository,
    GenerateCodeUtil,
    FileUploadService,
    FetchSchedulesService,
    RefreshTokenService,
    JwtService
  ],
  exports: [MentorRepository],
})
export class MentorModule {}
