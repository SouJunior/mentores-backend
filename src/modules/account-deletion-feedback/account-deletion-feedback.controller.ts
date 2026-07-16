import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AccountDeletionFeedbackCreateService } from './services/account-deletion-feedback.service';
import { FormValuesDeleteAccount } from './dto/formValuesDeleteAccount.dto';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { MentorEntity } from '../mentors/entities/mentor.entity';
import { LoggedEntity } from '../auth/decorator/loggedEntity.decorator';

@Controller('account-deletion-feedback')
export class AccountDeletionFeedbackController {
  constructor(
    private readonly accountDeletionFeedbackCreateService: AccountDeletionFeedbackCreateService,
  ) {}

  @ApiExcludeEndpoint()
  @UseGuards(AuthGuard())
  @Post()
  async create(
    @LoggedEntity() mentor: MentorEntity,
    @Body() formData: FormValuesDeleteAccount,
  ) {
    const data = {
      ...formData,
      mentor_id: mentor.id,
    }
    return this.accountDeletionFeedbackCreateService.execute(data);
  }
}
