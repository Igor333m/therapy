import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm'
import type { User } from './user.entity'

/** Day-of-week 0 = Sunday … 6 = Saturday (matches JS Date.getDay()) */
export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6

@Entity('availability_rules')
export class AvailabilityRule {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'therapist_id' })
  therapistId: string

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapist_id' })
  therapist: User

  @Column({ name: 'day_of_week', type: 'smallint' })
  dayOfWeek: DayOfWeek

  /** HH:MM in therapist local time */
  @Column({ name: 'start_time', length: 5 })
  startTime: string

  /** HH:MM in therapist local time */
  @Column({ name: 'end_time', length: 5 })
  endTime: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}

@Entity('availability_exceptions')
export class AvailabilityException {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'therapist_id' })
  therapistId: string

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapist_id' })
  therapist: User

  /** ISO date string YYYY-MM-DD */
  @Column({ name: 'exception_date', type: 'date' })
  exceptionDate: string

  /** If false, the therapist is unavailable the entire day */
  @Column({ name: 'is_available', default: false })
  isAvailable: boolean

  /** HH:MM override start time when isAvailable is true */
  @Column({ name: 'start_time', length: 5, nullable: true, type: 'varchar' })
  startTime: string | null

  /** HH:MM override end time when isAvailable is true */
  @Column({ name: 'end_time', length: 5, nullable: true, type: 'varchar' })
  endTime: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date
}
