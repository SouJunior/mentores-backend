import { Injectable } from '@nestjs/common';
import { TestimonyRepository } from './repository/testimony.repository';
import { CreateTestimonyDto } from './dto/create-testimony.dto';

@Injectable()
export class TestimonyService {
  constructor(private testimonyRepository: TestimonyRepository) {}

  async createTestimony(
    data: CreateTestimonyDto,
  ): Promise<{ message: string }> {
    data.userName.trim();
    data.userName[1].toUpperCase();

    const testimonyText = data.description.split(' ');

    let count = 0;
    for (let i = 0; i < testimonyText.length; i++) {
      if (testimonyText[i]) {
        count = count + 1;
        if (count === 1) {
          data.description =
            testimonyText[i][0].toUpperCase() +
            testimonyText[i].slice(1, testimonyText.length) +
            ' ';
        }
        if (count > 1) {
          data.description += testimonyText[i] + ' ';
        }
      }
    }

    console.log(data.description[0].toUpperCase());

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
      data.userName.trim();
      data.userName[1].toUpperCase();

      const testimonyText = data.description.split(' ');

      let count = 0;
      for (let i = 0; i < testimonyText.length; i++) {
        if (testimonyText[i]) {
          count = count + 1;
          if (count === 1) {
            data.description =
              testimonyText[i][0].toUpperCase() +
              testimonyText[i].slice(1, testimonyText.length) +
              ' ';
          }
          if (count > 1) {
            data.description += testimonyText[i] + ' ';
          }
        }
      }
    }

    testimonyExists.updatedAt = new Date();

    await this.testimonyRepository.editTestimony(id, data);

    return { message: 'Testimony updated successfully' };
  }
}
