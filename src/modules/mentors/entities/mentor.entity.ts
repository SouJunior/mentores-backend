import { HistoryEntity } from "./history.entity";

export class MentorEntity {
  id?: string;
  fullName: string;
  dateOfBirth: string | Date;
  password: string;
  email: string;
  emailConfirmed?: boolean;
  specialties: string[];
  profileKey?: string;
  profile?: string;
  accessAttempt?: number;
  code?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean;
}
