import { Gender } from "aws-sdk/clients/polly";
import { Specialties } from "../enums/specialties.enum";
import { HistoryEntity } from "./history.entity";

export class MentorEntity {
  id?: string;
  fullName: string;
  dateOfBirth: string | Date;
  password: string;
  email: string;
  emailConfirmed?: boolean;
  specialties: string[];
  gender: string
  aboutMe: string
  registerComplete?: boolean
  profileKey?: string;
  profile?: string;
  accessAttempt?: number;
  code?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean;
}
