import { Injectable } from '@nestjs/common';
import { CreateMentorDto } from '../dtos/create-mentor.dto';
import { CustomBadRequestException } from '../../../shared/exceptions/badRequest.exception';
import * as bcrypt from 'bcrypt';
import { MentorRepository } from '../repository/mentor.repository';
import { MailService } from '../../../modules/mails/mail.service';
import { GenerateCodeUtil } from '../../../shared/utils/generate-code.util';
import { InMemoryMentorRepository } from '../repository/inMemory/inMemoryMentor.repository';

@Injectable()
export class CreateMentorService {
  constructor(
    private mentorRepository: MentorRepository | InMemoryMentorRepository,
    private mailService: MailService,
    private generateCodeUtil: GenerateCodeUtil,
  ) {}

  async execute(data: CreateMentorDto): Promise<{ message: string }> {
    data.dateOfBirth = new Date(data.dateOfBirth);

    const mentorAlreadyExists = await this.mentorRepository.findMentorByEmail(
      data.email,
    );

    if (mentorAlreadyExists) {
      throw new CustomBadRequestException('User already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);
    data.code = this.generateCodeUtil.create();

    delete data.passwordConfirmation;
    delete data.emailConfirm;

    const newMentor = await this.mentorRepository.createNewMentor(data);

    await this.mailService.mentorSendCreationConfirmation(newMentor);

    return { message: 'Mentor created successfully' };
  }
}
