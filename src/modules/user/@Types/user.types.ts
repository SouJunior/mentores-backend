import { UserEntity } from "../entity/user.entity";

export interface IRepositoryResponse {
  result?: UserEntity[];
  message: string;
}