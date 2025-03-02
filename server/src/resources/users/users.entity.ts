import { IsEmail } from 'class-validator';
import { BaseEntity } from 'src/classes/BaseEntity';
import { userRoles, UserRoleType } from 'src/types/auth';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column()
  name: string;

  @Column({ select: false })
  password: string;

  @Column({ select: false })
  salt: string;

  // Generate Role column
  @Column({
    type: 'enum',
    enum: userRoles,
    default: 'user',
  })
  role: UserRoleType;
}
