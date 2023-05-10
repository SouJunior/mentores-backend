import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserRepository } from './repository/user.repository';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { MailModule } from '../mails/mail.module';

@Module({
  imports: [MailModule, PassportModule.register({ defaultStrategy: 'jwt' })],
  controllers: [UserController],
  providers: [UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
