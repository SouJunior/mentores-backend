import { Injectable } from '@nestjs/common';
import { MentorEntity } from '../../entities/mentor.entity';
import { CreateMentorDto } from '../../dtos/create-mentor.dto';
import { UpdateMentorDto } from '../../dtos/update-mentor.dto';

@Injectable()
export class InMemoryMentorRepository {
  public mentors: MentorEntity[] = [];
  private idCounter = 1;
  constructor() {}
  async createNewMentor(data: CreateMentorDto): Promise<MentorEntity> {
    const newMentor: MentorEntity = {
      id: String(this.idCounter++),
      ...data,
      deleted: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      registerComplete: false,
    };
    this.mentors.push(newMentor);
    return newMentor;
  }

  async findAllMentors(): Promise<MentorEntity[]> {
    return this.mentors.filter((mentor) => !mentor.deleted);
  }

  async findAllRegisteredMentors(): Promise<MentorEntity[]> {
    return this.mentors.filter(
      (mentor) => mentor.registerComplete && !mentor.deleted,
    );
  }

  async findMentorByEmail(email: string): Promise<MentorEntity | null> {
    return (
      this.mentors.find(
        (mentor) => mentor.email === email && !mentor.deleted,
      ) || null
    );
  }

  async findFullMentorById(id: string): Promise<MentorEntity | null> {
    return (
      this.mentors.find((mentor) => mentor.id === id && !mentor.deleted) || null
    );
  }

  async findMentorById(id: string) {
    const mentor = this.mentors.find(
      (mentor) => mentor.id === id);

    if (!mentor) return null;

    const {
      id: mentorId,
      fullName,
      dateOfBirth,
      email,
      specialties,
      gender,
      profile,
      aboutMe,
      registerComplete,
      deleted,
      createdAt,
      updatedAt,
    } = mentor;

    return {
      id: mentorId,
      fullName,
      dateOfBirth,
      email,
      specialties,
      gender,
      profile,
      aboutMe,
      registerComplete,
      deleted,
      createdAt,
      updatedAt,
    };
  }

  async findMentorByNameAndRole(
    fullName?: string,
    specialty?: string,
  ): Promise<MentorEntity[]> {
    return this.mentors.filter(
      (mentor) =>
        !mentor.deleted &&
        (!specialty || mentor.specialties?.includes(specialty)) &&
        (!fullName ||
          mentor.fullName?.toLowerCase().includes(fullName.toLowerCase())),
    );
  }

  async deactivateMentorById(id: string): Promise<MentorEntity | null> {
    const mentor = this.mentors.find((mentor) => mentor.id === id);
    if (mentor) {
      mentor.deleted = true;
      mentor.updatedAt = new Date();
    }
    return mentor || null;
  }

  async updateMentor(id: string, data: UpdateMentorDto): Promise<void> {
    const mentor = this.mentors.find((mentor) => mentor.id === id);
    if (mentor) {
      Object.assign(mentor, data);
      mentor.updatedAt = new Date();
    }
  }

  async updateMentorUrl(id: string, urlImage: string): Promise<void> {
    const mentor = this.mentors.find((mentor) => mentor.id === id);
    if (mentor) {
      mentor.profile = urlImage;
      mentor.updatedAt = new Date();
    }
  }

  async registerCompleteToggle(id: string): Promise<void> {
    const mentor = this.mentors.find((mentor) => mentor.id === id);
    if (mentor) {
      mentor.registerComplete = true;
      mentor.updatedAt = new Date();
    }
  }
}

