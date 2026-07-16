import { Injectable } from '@nestjs/common';
import { CreateMentorDto } from '../dtos/create-mentor.dto';
import { CustomBadRequestException } from '../../../shared/exceptions/badRequest.exception';
import * as bcrypt from 'bcrypt';
import { MentorRepository } from '../repository/mentor.repository';
import { MailService } from '../../../modules/mails/mail.service';
import { GenerateCodeUtil } from '../../../shared/utils/generate-code.util';

@Injectable()
export class CreateMentorService {
  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
  ) {}

  async execute(data: CreateMentorDto): Promise<{ message: string, statusCode: number }> {
    data.dateOfBirth = new Date(data.dateOfBirth);
    const generateCodeUtil = new GenerateCodeUtil();
    const mentorAlreadyExists = await this.mentorRepository.findMentorByEmail(
      data.email,
    );

    if (mentorAlreadyExists) {
      throw new CustomBadRequestException('User already exists');
    }

    data.password = await bcrypt.hash(data.password, 10);
    data.code = generateCodeUtil.create();

    const newMentor = await this.mentorRepository.createNewMentor(data);

    await this.mailService.mentorSendCreationConfirmation(newMentor);

    return { message: 'Mentor created successfully', statusCode: 201 };
  }
}
