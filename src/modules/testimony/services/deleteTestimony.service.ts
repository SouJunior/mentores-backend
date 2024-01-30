import { Injectable } from '@nestjs/common';
import { TestimonyRepository } from '../repository/testimony.repository';

@Injectable()
export class DeleteTestimonyService {
  constructor(private testimonyRepository: TestimonyRepository) {}

  async execute(id: string): Promise<{ message: string }> {
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
