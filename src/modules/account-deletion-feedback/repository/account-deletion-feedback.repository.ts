import { Injectable } from '@nestjs/common';
import { FormValuesDeleteAccount } from '../dto/formValuesDeleteAccount.dto';
import { PrismaClient } from '@prisma/client';

Injectable();
export class AccountDeletionFeedbackRepository extends PrismaClient {
  async create(data: FormValuesDeleteAccount): Promise<void> {
    try {
      await this.accountDeletionFeedback.create({ data });
    } catch (error) {
      throw new Error(`Failed to create account deletion feedback: ${error.message}`);
    }
  }
}
