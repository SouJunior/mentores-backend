import {
  BadRequestException,
  Injectable,
  NotFoundException,
  PipeTransform,
} from '@nestjs/common';
import { EntityTarget, FindOneOptions, getRepository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { UserEntity } from '../../database/entities/user.entity';

type Entities = UserEntity;

export type EntityRelations<Entity> = {
  [Key in keyof Entity]: Entity[Key] extends Entities
    ? Key
    : Entity[Key] extends Entities[]
    ? Key
    : Key;
}[keyof Entity];

@Injectable()
export default class GetEntity<Model> implements PipeTransform {
  private readonly relations: any;

  constructor(
    private readonly entity: EntityTarget<Model>,
    relations?: EntityRelations<Model> | EntityRelations<Model>[],
    private readonly field = 'id',
  ) {
    this.relations = typeof relations === 'string' ? [relations] : relations;
  }

  async transform(value: any) {
    if (!value || value === '' || value === 'undefined') {
      throw new BadRequestException('No entity id provided');
    }

    if (!isValidUUID(value)) {
      throw new BadRequestException('Invalid id');
    }

    const entity = await getRepository(this.entity).findOne({
      where: { [this.field]: value },
      relations: this.relations,
    } as FindOneOptions<Model>);

    if (!entity) {
      const entity = `${this.entity.toString()}`
        .match(/\w+/g)[1]
        .replace('Entity', '');

      throw new NotFoundException(`Validation failed for ${entity} value`);
    }

    return entity;
  }
}
