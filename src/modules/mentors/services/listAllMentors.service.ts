import { Injectable } from "@nestjs/common";
import { MentorRepository } from "../repository/mentor.repository";
import { MentorEntity } from "../entities/mentor.entity";

@Injectable()
export class ListAllMentorsService {
  constructor(
    private mentorRepository: MentorRepository,
  ) {}

  async execute(): Promise<MentorEntity[]> {
    return this.mentorRepository.findAllMentors();
  }
}