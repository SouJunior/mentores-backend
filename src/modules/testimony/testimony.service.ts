import { Injectable } from '@nestjs/common';
import { TestimonyRepository } from './repository/testimony.repository';
import { CreateTestimonyDto } from './dto/create-testimony.dto';
import {
  dataFormatter,
  dateFormatter,
} from '../../shared/utils/formatters.utils';

@Injectable()
export class TestimonyService {
  constructor(private testimonyRepository: TestimonyRepository) {}

  async createTestimony(
    data: CreateTestimonyDto,
  ): Promise<{ message: string }> {
    dataFormatter(data);

    this.testimonyRepository.createNewTestimony(data);

    return { message: 'Testimony created successfully' };
  }

  async editTestimony(
    id: string,
    data: CreateTestimonyDto,
  ): Promise<{ message: string }> {
    const testimonyExists = await this.testimonyRepository.findTestimonyById(
      id,
    );

    if (!testimonyExists) {
      return { message: 'There are no testimony with that id.' };
    }

    if (
      testimonyExists.userName !== data.userName ||
      testimonyExists.description !== data.description
    ) {
      dataFormatter(data);
    }

    await this.testimonyRepository.editTestimony(id, data);

    return { message: 'Testimony updated successfully' };
  }

  async deleteTestimony(id: string): Promise<{ message: string }> {
    const testimonyExists = await this.testimonyRepository.findTestimonyById(
      id,
    );

    if (!testimonyExists) {
      return { message: 'There are no testimony with that id' };
    }

    await this.testimonyRepository.deleteTestimony(id);

    return { message: 'Testimony deleted successfully' };
  }
}
