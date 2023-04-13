import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ update: true })
  updatedAt: Date;

  constructor(user?: Partial<UserEntity>) {
    this.id = user?.id;
    this.firstName = user?.firstName;
    this.lastName = user?.lastName;
    this.email = user?.email;
    this.isActive = user?.isActive;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
  }
}
