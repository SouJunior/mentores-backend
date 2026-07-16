import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/service/prisma.service';
import { MentorEntity } from 'src/modules/mentors/entities/mentor.entity';
import { Gender } from 'src/modules/mentors/enums/gender.enum';
import { Specialties } from 'src/modules/mentors/enums/specialties.enum';

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()\-_=+{};:,<.>])[a-zA-Z\d!@#$%^&*()\-_=+{};:,<.>]{8,}$/;

const generatePassword = (): string => {
  let password;
  do {
    password = faker.internet.password({length: 12, memorable: false});
  } while (!passwordRegex.test(password));
  return password;
};

export const makeMentor = (override: Partial<MentorEntity> = {}) => {
  const specialtiesValues = Object.values(Specialties);
  const genderValues = Object.values(Gender);
  
  return {
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: generatePassword(),
    dateOfBirth: new Date(
      faker.date.past({
        years: 30,
        refDate: new Date(),
      }).toISOString(),
    ),
    gender: faker.helpers.arrayElement(genderValues),
    aboutMe: faker.lorem.sentence(),
    specialties: faker.helpers.arrayElements(specialtiesValues, faker.number.int({ min: 1, max: 3 })),
    emailConfirmed: true,
    ...override,
  };
};

@Injectable()
export class MentorFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaMentor(data: Partial<MentorEntity> = {}): Promise<MentorEntity> {
        const mentor = makeMentor(data)

        await this.prisma.mentors.create({
            data: mentor
        })

        return mentor
    }
}
