import {
  Column,
  CreateDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { UserRole } from '@therapy/shared'
import type { TherapistProfile } from './therapist-profile.entity'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true, length: 320 })
  email: string

  @Column({ name: 'password_hash' })
  passwordHash: string

  @Column({ type: 'varchar', length: 20, default: 'client' })
  role: UserRole

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean

  @Column({ name: 'email_verification_token', nullable: true, type: 'varchar' })
  emailVerificationToken: string | null

  @Column({ name: 'refresh_token_hash', nullable: true, type: 'varchar' })
  refreshTokenHash: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @OneToOne('TherapistProfile', 'user')
  therapistProfile?: TherapistProfile
}
