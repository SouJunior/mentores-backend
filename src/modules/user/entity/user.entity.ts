export class UserEntity {
  id?: string;
  fullName: string;
  dateOfBirth: string | Date;
  password: string;
  email: string;
  emailConfirmed?: boolean;
  role: string;
  accessAttempt?: number;
  code?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  deleted?: boolean;
}
