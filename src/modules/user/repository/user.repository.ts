import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../../../database/entities/user.entity';
import { handleError } from 'shared/utils/handle-error.util';

@EntityRepository(UserEntity)
export class UserRepository extends Repository<UserEntity> {
  async findAllUsers(): Promise<UserEntity[]> {
    return this.find().catch(handleError);
  }
}
