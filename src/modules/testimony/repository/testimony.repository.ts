import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { handleError } from '../../../shared/utils/handle-error.util';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { TestimonyEntity } from '../entity/testimony.entity';

@Injectable()
export class TestimonyRepository extends PrismaClient {
  async createNewTestimony(data: CreateTestimonyDto): Promise<TestimonyEntity> {
    return this.testimony.create({ data }).catch(handleError);
  }

  async editTestimony(
    id: string,
    data: CreateTestimonyDto,
  ): Promise<TestimonyEntity> {
    return this.testimony.update({ where: { id }, data }).catch(handleError);
  }

  async findTestimonyByUser(userName: string): Promise<TestimonyEntity> {
    return this.testimony
      .findFirst({
        where: { userName },
      })
      .catch(handleError);
  }

  async findAlltestimony(): Promise<TestimonyEntity[]> {
    return this.testimony.findMany().catch(handleError);
  }

  async findTestimonyById(id: string): Promise<TestimonyEntity> {
    return this.testimony
      .findUnique({
        where: { id },
      })
      .catch(handleError);
  }
}
