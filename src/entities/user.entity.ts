import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { USER_ROLES } from "../modules/auth/constants";

@Entity({name: "users"})
export class User {
  @PrimaryGeneratedColumn("identity")
  id!: number;

  @Column({ type: String, length: 120 })
  name!: string;

  @Column({ type: String,  length: 120, unique: true })
  email!: string;

  @Column({ type: String,  length: 18 })
  phone!: string;

  @Column({ type: String })
  password!: string;

  @Column({ type: String, nullable: true})
  verificationToken: string | null;

  @Column({type: "timestamp with time zone"})
  verificationTokenExpiry: Date;

  @Column({ type: Boolean, default: false})
  emailVerified!: boolean;

  @Column({ type: String, enum: USER_ROLES})
  role!: string;

  @Column({type: "timestamp with time zone"})
  createdAt: Date;

  @Column({type: "timestamp with time zone"})
  updatedAt: Date;
}
