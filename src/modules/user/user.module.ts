import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailModule } from '../mails/mail.module';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UserController],
  providers: [UserService, UserRepository, GenerateCodeUtil],
  exports: [UserRepository],
})
export class UserModule {}
