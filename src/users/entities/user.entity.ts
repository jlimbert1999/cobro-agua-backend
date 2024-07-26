import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum UserRole {
  ADMIN = 'admin',
  OFFICER = 'officer',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;
  
  @Column()
  fullname: string;

  @Column()
  password: string;

  @Column({ unique: true })
  login: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    array: true,
    default: [UserRole.OFFICER],
  })
  roles: UserRole[];
}
