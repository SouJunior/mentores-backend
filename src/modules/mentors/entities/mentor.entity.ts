export class MentorEntity {
  id?: string;
  fullName: string;
  dateOfBirth: string | Date;
  password?: string;
  email: string;
  emailConfirmed?: boolean;
  specialties?: string[];
  role?: string;
  gender?: string;
  aboutMe?: string;
  registerComplete?: boolean;
  profileKey?: string;
  profile?: string;
  accessAttempt?: number;
  code?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean;
  deactivatedDays?: number;
  deactivatedAt?: Date | null | string; // Estou na dúvida se realmente precisa do string aqui, preciso tirar essa dúvida
}
