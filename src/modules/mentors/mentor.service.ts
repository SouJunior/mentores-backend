import * as bcrypt from 'bcrypt';
import { GenerateCodeUtil } from '../../shared/utils/generate-code.util';
import { MailService } from '../mails/mail.service';
import { ActiveMentorDto } from './dtos/active-mentor.dto';
import { CreateMentorDto } from './dtos/create-mentor.dto';
import { UpdateMentorDto } from './dtos/update-mentor.dto';
import { MentorEntity } from './entities/mentor.entity';
import { MentorRepository } from './repository/mentor.repository';
import { MentorPassConfirmationDto } from './dtos/mentor-pass-confirmation.dto';
import { CustomNotFoundException } from "../../shared/exceptions/notFound.exception"
import { CustomBadRequestException } from "../../shared/exceptions/badRequest.exception";
import { FileUploadService } from '../upload/upload.service';
import {Injectable } from '@nestjs/common';

@Injectable()
export class MentorService {
  constructor(
    private mentorRepository: MentorRepository,
    private mailService: MailService,
    private generateCodeUtil: GenerateCodeUtil,
    private fileUploadService: FileUploadService
  ) {}

  async createMentor(data: CreateMentorDto): Promise<{ message: string }> {
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

  async getAllMentors(): Promise<MentorEntity[]> {
    return this.mentorRepository.findAllMentors();
  }

  async findMentorById(id: string): Promise<any> {
    const user = await this.mentorRepository.findMentorById(id);

    if (!user) {
      return {
        status: 404,
        data: { message: 'Mentor not found' },
      };
    }

    return {
      status: 200,
      data: user,
    };
  }

  async findMentorByNameAndRole(
    fullName?: string,
    specialty?: string,
  ): Promise<MentorEntity[]> {
    const users = await this.mentorRepository.findMentorByNameAndRole(
      fullName,
      specialty,
    );
    
    return users;
  }

  async updateMentor(id: string, data: UpdateMentorDto) {

    const mentorExists = await this.mentorRepository.findMentorById(id)

    if (!mentorExists) {
      throw new CustomNotFoundException("There are no mentor with that id")
    }

    if (!data.registerComplete) {
    data.registerComplete = true;
    }

    try {
    await this.mentorRepository.updateMentor(id, data)

    return { message: "The mentor was updated successfully", status: 200}

    } catch(error) {
      throw new CustomBadRequestException("Something went wrong in the database")
    }
  }

  async uploadProfileImage(id: string, mentor: UpdateMentorDto, file) {

    mentor.profileKey = "genericImage"
    if (file && !mentor.profileKey) {
      throw new CustomBadRequestException("profileKey is required when file is sent")
    }

    if (file) {
      await this.fileUploadService.deleteFile(mentor.profileKey);
      const { Location, key } = await this.fileUploadService.upload(file);
      mentor.profile = Location;
      mentor.profileKey = key;

      await this.mentorRepository.updateMentorUrl(id, mentor.profile)

    }

    delete mentor.file
  
    return { message: "The profile image was updated succesfully", status: 200}
  }

  async desactivateLoggedMentor(id: string): Promise<{ message: string }> {
    await this.mentorRepository.desativateMentorById(id);

    return { message: 'Mentor deactivated successfully' };
  }

  async activeMentor({ code, email }: ActiveMentorDto) {
    const mentorExists = await this.mentorRepository.findMentorByEmail(email);

    if (!mentorExists || mentorExists.code != code) {
      return {
        status: 404,
        data: { message: 'Mentor not found' },
      };
    }

    mentorExists.code = null;
    mentorExists.emailConfirmed = true;

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    return {
      status: 200,
      data: { message: 'Email confirmed successfully' },
    };
  }

  async sendRestorationEmail(email: string): Promise<{
    message: string;
    userData?: ActiveMentorDto;
  }> {
    const mentorExists = await this.mentorRepository.findMentorByEmail(email);

    if (!mentorExists) {
      return {
        message: 'Mentor not found',
      };
    }

    mentorExists.code = this.generateCodeUtil.create();

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    await this.mailService.mentorSendRestorationEmail(mentorExists);

    return {
      message: 'E-mail de recuperação enviado',
      userData: { code: mentorExists.code, email: mentorExists.email },
    };
  }

  async redefineMentorPassword(
    queryData : ActiveMentorDto, passData: MentorPassConfirmationDto
  ): Promise<{ message: string }> {
    const mentorExists = await this.mentorRepository.findMentorByEmail(queryData.email);

    if (!mentorExists) {
      return {
        message: 'Mentor not found',
      };
    }

    if (mentorExists.code != queryData.code) {
      return {
        message: 'The code is invalid',
      };
    }

    if (passData.password !== passData.confirmPassword) {
      return {
        message: "The passwords don't match",
      };
    }

    mentorExists.password = await bcrypt.hash(passData.password, 10);

    mentorExists.code = null;
    mentorExists.accessAttempt = 0

    await this.mentorRepository.updateMentor(mentorExists.id, mentorExists);

    return {
      message: 'The account was restored sucessfully',
    };
  }

    async finishMentorRegister(id: string) {
      const mentor = await this.mentorRepository.findMentorById(id)

      if (mentor.registerComplete) {
        return {
          message: 'The user has already finished his registration'
        }
      }
      await this.mentorRepository.registerCompleteToggle(id)

      return {
        message: "The registration was declared as completed."
      }
    }
}
