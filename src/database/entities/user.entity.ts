import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

enum StatusEnum {
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
}

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  password: string;

  @Column()
  email: string;

  @Column({ default: false })
  mailConfirm: boolean;

  @Column({ default: 0 })
  accessAttempt: number;

  @Column({ nullable: true })
  code: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn({ update: true })
  updatedAt: Date;

  @Column({ default: StatusEnum.ACTIVE })
  status: StatusEnum;

  constructor(user?: Partial<UserEntity>) {
    this.id = user?.id;
    this.fullName = user?.fullName;
    this.dateOfBirth = user?.dateOfBirth;
    this.email = user?.email;
    this.mailConfirm = user?.mailConfirm;
    this.status = user?.status;
    this.createdAt = user?.createdAt;
    this.updatedAt = user?.updatedAt;
  }
}
