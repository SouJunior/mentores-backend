import { Injectable } from '@nestjs/common';
import { FormValuesDeleteAccount } from 'src/modules/account-deletion-feedback/dto/formValuesDeleteAccount.dto';
import { AccountDeletionFeedbackRepository } from '../repository/account-deletion-feedback.repository';

@Injectable()
export class AccountDeletionFeedbackCreateService {
  constructor(private accountDeletionFeedbackRepository: AccountDeletionFeedbackRepository) {}

  async execute(data: FormValuesDeleteAccount) {
    await this.accountDeletionFeedbackRepository.create(data);

    return {
      status: 201,
      data: { message: 'Feedback submitted successfully' },
    };
  }
}
