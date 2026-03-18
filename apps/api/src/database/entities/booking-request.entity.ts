import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { User } from './user.entity'

export type BookingStatus =
  | 'pending'
  | 'confirmed'
  | 'cancelled_by_client'
  | 'cancelled_by_therapist'
  | 'completed'

@Entity('booking_requests')
export class BookingRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'client_id' })
  clientId: string

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'client_id' })
  client: User

  @Column({ name: 'therapist_id' })
  therapistId: string

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapist_id' })
  therapist: User

  /** UTC timestamp for the requested session start */
  @Column({ name: 'start_at_utc', type: 'timestamptz' })
  startAtUtc: Date

  /** Duration in minutes */
  @Column({ name: 'duration_minutes', type: 'smallint', default: 50 })
  durationMinutes: number

  @Column({ type: 'varchar', length: 30, default: 'pending' })
  status: BookingStatus

  @Column({ type: 'text', nullable: true })
  clientNote: string | null

  @Column({ type: 'text', nullable: true })
  therapistNote: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
