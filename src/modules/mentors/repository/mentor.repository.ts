import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateMentorDto } from '../dtos/create-mentor.dto';
import { MentorEntity } from '../entities/mentor.entity';
import { UpdateMentorDto } from '../dtos/update-mentor.dto';

@Injectable()
export class MentorRepository extends PrismaClient {
  async createNewMentor(data: CreateMentorDto): Promise<MentorEntity> {
    return this.mentors.create({ data }).catch(handleError);
  }

  async findAllMentors(): Promise<MentorEntity[]> {
    return this.mentors.findMany().catch(handleError);
  }

  async findMentorByEmail(email: string): Promise<MentorEntity> {
    return this.mentors.findUnique({
      where: { email },
    })
    .catch(handleError);
  }

  async findMentorById(id: string): Promise<any> {
    return this.mentors
      .findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          email: true,
          specialties: true,
          createdAt: true,
          updatedAt: true,
        },
      })
      .catch(handleError);
  }

  async findMentorByNameAndRole(
    fullName?: string,
    specialty?: string,
  ): Promise<MentorEntity[]> {
    const mentors = await this.mentors
      .findMany({
        where: {
          deleted: false,
          OR: [
            { specialties: {has: specialty}} ,
            { fullName: fullName
              ? { contains: fullName, mode: 'insensitive' }
              : undefined}
          ]
        },
      })
      .catch(handleError);

    return mentors;
  }

  async desativateMentorById(id: string): Promise<MentorEntity> {
    return this.mentors
      .update({
        where: {
          id,
        },
        data: {
          deleted: true,
        },
      })
      .catch(handleError);
  }

  async updateMentor(id: string, data: UpdateMentorDto): Promise<void> {
    await this.mentors
      .update({ where: { id }, data})
      .catch(handleError);

    return;
  }
}
