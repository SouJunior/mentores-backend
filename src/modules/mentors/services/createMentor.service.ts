import { Injectable } from "@nestjs/common";
import { CreateMentorDto } from "../dtos/create-mentor.dto";
import { CustomBadRequestException } from "src/shared/exceptions/badRequest.exception";
import * as bcrypt from 'bcrypt';
import { MentorRepository } from "../repository/mentor.repository";
import { MailService } from "src/modules/mails/mail.service";
import { GenerateCodeUtil } from "src/shared/utils/generate-code.util";

@Injectable()
export class CreateMentorService {
  constructor(
    private mentorRepository: MentorRepository,
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