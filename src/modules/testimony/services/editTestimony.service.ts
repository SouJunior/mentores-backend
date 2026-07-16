import { Injectable } from '@nestjs/common';
import { TestimonyRepository } from '../repository/testimony.repository';
import { CreateTestimonyDto } from '../dto/create-testimony.dto';
import { dataFormatter } from '../../../shared/utils/formatters.utils';

@Injectable()
export class EditTestimonyService {
  constructor(private testimonyRepository: TestimonyRepository) {}

  async execute(
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
}
