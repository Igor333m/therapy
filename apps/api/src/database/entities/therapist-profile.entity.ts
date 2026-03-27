import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { User } from './user.entity'
import type { Service } from './service.entity'

export type VerificationStatus = 'pending' | 'approved' | 'rejected'

@Entity('therapist_profiles')
export class TherapistProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'slug', length: 160, unique: true })
  slug: string

  @Column({ name: 'user_id' })
  userId: string

  @OneToOne('User', 'therapistProfile')
  @JoinColumn({ name: 'user_id' })
  user: User

  @Column({ name: 'display_name', length: 120 })
  displayName: string

  @Column({ type: 'text', nullable: true })
  bio: string | null

  @Column({ name: 'avatar_url', type: 'varchar', length: 255, nullable: true })
  avatarUrl: string | null

  @Column({ name: 'verification_status', type: 'varchar', length: 20, default: 'pending' })
  verificationStatus: VerificationStatus

  @Column({ name: 'verified_at', nullable: true, type: 'timestamptz' })
  verifiedAt: Date | null

  @Column({ name: 'verified_by_id', nullable: true, type: 'uuid' })
  verifiedById: string | null

  /** ISO country codes where this therapist offers services */
  @Column({ name: 'country_codes', type: 'text', array: true, default: '{}' })
  countryCodes: string[]

  /** BCP-47 language codes the therapist speaks */
  @Column({ name: 'language_codes', type: 'text', array: true, default: '{}' })
  languageCodes: string[]

  @ManyToMany('Service', 'therapistProfiles')
  services: Service[]

  @Column({ name: 'years_experience', nullable: true, type: 'smallint' })
  yearsExperience: number | null

  @Column({ name: 'session_price_usd_cents', nullable: true, type: 'integer' })
  sessionPriceUsdCents: number | null

  @Column({ name: 'timezone', nullable: true, length: 64, type: 'varchar' })
  timezone: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  /** Self-referencing moderator comments for rejection */
  @ManyToOne('User', { nullable: true, eager: false, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'verified_by_id' })
  verifiedBy: User | null
}
