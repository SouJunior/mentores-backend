import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { TestimonyEntity } from '../entity/testimony.entity';
import { dateFormatter } from '../../../shared/utils/formatters.utils';

@Injectable()
export class TestimonyRepository extends PrismaClient {
  async createNewTestimony(data: CreateTestimonyDto, mentorId: string): Promise<TestimonyEntity> {
    Object.assign(data, {
      mentor_id: mentorId,
      createdAt: dateFormatter(),
      updatedAt: dateFormatter(),
    });

    return this.testimony.create({ data }).catch(handleError);
  }

  async editTestimony(
    id: string,
    data: Partial<CreateTestimonyDto>,
  ): Promise<TestimonyEntity> {
    Object.assign(data, {
      updatedAt: dateFormatter(),
    });

    return this.testimony.update({ where: { id }, data }).catch(handleError);
  }

  async deleteTestimony(id: string): Promise<{ message: string }> {
    this.testimony.delete({ where: { id } }).catch(handleError);

    return { message: 'Testimony deleted sucessfully' };
  }

  async findTestimonyByUser(userName: string): Promise<TestimonyEntity> {
    return this.testimony
      .findFirst({
        where: { userName },
      })
      .catch(handleError);
  }

  async findAlltestimony(): Promise<TestimonyEntity[]> {
    return this.testimony.findMany({ select: {id: true, mentor_id: true, userName: true, role: true, description: true, imageUrl: true}}).catch(handleError);
  }

  async findTestimonyById(id: string): Promise<TestimonyEntity> {
    return this.testimony
      .findUnique({
        where: { id },
      })
      .catch(handleError);
  }
}
