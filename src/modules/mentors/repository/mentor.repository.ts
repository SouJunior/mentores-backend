import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateMentorDto } from '../dtos/create-mentor.dto';
import { UpdateMentorDto } from '../dtos/update-mentor.dto';
import { MentorEntity } from '../entities/mentor.entity';

@Injectable()
export class MentorRepository extends PrismaClient {
  async findDeactivatedMentors(): Promise<MentorEntity[]> {
    return this.mentors
      .findMany({
        where: {
          deleted: true,
        },
      })
      .catch(handleError);
  }

  async createNewMentor(data: CreateMentorDto): Promise<MentorEntity> {
    return this.mentors.create({ data }).catch(handleError);
  }

  async findAllMentors(): Promise<MentorEntity[]> {
    return this.mentors.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        gender: true,
        aboutMe: true,
        specialties: true,
        role: true,
        dateOfBirth: true,
        emailConfirmed: true,
        registerComplete: true,
        accessAttempt: true,
        code: true,
        deleted: true,
        calendlyInfo: true,
        history: true,
        testimony: true,
        createdAt: true,
        updatedAt: true
      },
      where: {
        deleted: false
      }
    }).catch(handleError);
  }

  async findAllRegisteredMentors(): Promise<MentorEntity[]> {
    return this.mentors
      .findMany({ where: { registerComplete: true, deleted: false } })
      .catch(handleError);
  }

  async findMentorByEmail(email: string): Promise<MentorEntity> {
    return this.mentors
      .findUnique({
        where: { email },
      })
      .catch(handleError);
  }

  async findFullMentorById(id: string): Promise<MentorEntity> {
    return this.mentors
      .findUnique({
        where: { id },
      })
      .catch(handleError);
  }

  async findMentorById(id: string) {
    return this.mentors
      .findUnique({
        where: { id },
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          email: true,
          specialties: true,
          gender: true,
          aboutMe: true,
          registerComplete: true,
          deleted: true,
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
        select: {
          id: true,
          fullName: true,
          dateOfBirth: true,
          email: true,
          specialties: true,
          gender: true,
          aboutMe: true,
        },
        where: {
          deleted: false,
          OR: [
            { specialties: { has: specialty } },
            {
              fullName: fullName
                ? { contains: fullName, mode: 'insensitive' }
                : undefined,
            },
          ],
        },
      })
      .catch(handleError);

    return mentors;
  }

  async findMentorsBySingleQuery(query: string): Promise<MentorEntity[]> {
  return this.mentors.findMany({
    select: {
      id: true,
      fullName: true,
      dateOfBirth: true,
      email: true,
      specialties: true,
      gender: true,
      aboutMe: true,
    },
    where: {
      deleted: false,
      OR: [
        {
          fullName: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          specialties: {
            has: query,
          },
        },
      ],
    },
  });
}

  async deactivateMentorById(id: string): Promise<MentorEntity> {
    return this.mentors
      .update({
        where: {
          id,
        },
        data: {
          deleted: true,
          updatedAt: new Date(),
          deactivatedAt: new Date(),
        },
      })
      .catch(handleError);
  }

  async updateMentor(id: string, data: UpdateMentorDto): Promise<void> {
    await this.mentors.update({ where: { id }, data }).catch(handleError);
  }

  async updateMentorUrl(id: string, urlImage: string): Promise<void> {
    await this.mentors
      .update({ where: { id }, data: { profile: urlImage } })
      .catch(handleError);
  }

  async registerCompleteToggle(id: string): Promise<void> {
    await this.mentors
      .update({ where: { id }, data: { registerComplete: true } })
      .catch(handleError);
  }

  async findExpiredMentorsAndDelete(): Promise<void> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const expiredMentors = await this.mentors.findMany({
      where: {
        deleted: true,
        deactivatedAt: {
          lte: thirtyDaysAgo, //let == menor ou igual a
        },
      },
    });

    if (expiredMentors.length > 0) {
      const idsToDelete = expiredMentors.map((mentor) => mentor.id);

      await this.mentors.deleteMany({
        where: {
          id: {
            in: idsToDelete,
          },
        },
      });
      console.log(`${idsToDelete.length} mentores expirados foram excluídos permanentemente.`);
    }

  }

  async findMentorsDeactivatedFor(days: number): Promise<MentorEntity[]> {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() - days);

  const startDate = new Date(targetDate.setHours(0, 0, 0, 0)); // Início do dia
  const endDate = new Date(targetDate.setHours(23, 59, 59, 999)); // Fim do dia

  return this.mentors.findMany({
    where: {
      deleted: true,
      deactivatedAt: {
        gte: startDate, // Maior ou igual ao início do dia
        lte: endDate,   // Menor ou igual ao fim do dia
      },
    },
  });
}
}

