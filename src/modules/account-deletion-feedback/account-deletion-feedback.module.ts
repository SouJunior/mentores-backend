import { Module } from '@nestjs/common';
import { AccountDeletionFeedbackCreateService } from './services/account-deletion-feedback.service';
import { AccountDeletionFeedbackController } from './account-deletion-feedback.controller';
import { AccountDeletionFeedbackRepository } from './repository/account-deletion-feedback.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
      PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AccountDeletionFeedbackController],
  providers: [AccountDeletionFeedbackCreateService, AccountDeletionFeedbackRepository, JwtService],

  exports: [AccountDeletionFeedbackRepository],
})
export class AccountDeletionFeedbackModule {}
