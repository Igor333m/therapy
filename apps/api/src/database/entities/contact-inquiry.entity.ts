import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn
} from 'typeorm'
import type { AppLocale } from '@therapy/shared'

export type InquiryStatus = 'new' | 'read' | 'replied' | 'closed'

@Entity('contact_inquiries')
export class ContactInquiry {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ length: 150 })
  name: string

  @Column({ length: 320 })
  email: string

  /** Optional — if signed-in client sends from their profile */
  @Column({ name: 'user_id', nullable: true, type: 'uuid' })
  userId: string | null

  /** Optional — directed to a specific therapist */
  @Column({ name: 'therapist_id', nullable: true, type: 'uuid' })
  therapistId: string | null

  @Column({ type: 'text' })
  message: string

  @Column({ type: 'varchar', length: 5, default: 'en' })
  locale: AppLocale

  @Column({ type: 'varchar', length: 20, default: 'new' })
  status: InquiryStatus

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
