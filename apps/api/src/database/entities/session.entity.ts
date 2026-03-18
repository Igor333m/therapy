import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm'
import type { BookingRequest } from './booking-request.entity'
import type { User } from './user.entity'

export type RecordingStatus =
  | 'acquiring'
  | 'recording'
  | 'stopping'
  | 'uploaded'
  | 'failed'

@Entity('session_recordings')
export class SessionRecording {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'booking_request_id' })
  bookingRequestId: string

@OneToOne('BookingRequest', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'booking_request_id' })
  bookingRequest: BookingRequest

  /** Agora Cloud Recording resource ID (valid for 5 min at acquire time) */
  @Column({ name: 'resource_id', length: 255, nullable: true, type: 'varchar' })
  resourceId: string | null

  /** Agora session ID returned by start */
  @Column({ name: 'sid', length: 255, nullable: true, type: 'varchar' })
  sid: string | null

  @Column({ type: 'varchar', length: 30, default: 'acquiring' })
  recordingStatus: RecordingStatus

  /** S3 object key of the composite recording file */
  @Column({ name: 's3_key', length: 512, nullable: true, type: 'varchar' })
  s3Key: string | null

  @Column({ name: 'started_at', nullable: true, type: 'timestamptz' })
  startedAt: Date | null

  @Column({ name: 'stopped_at', nullable: true, type: 'timestamptz' })
  stoppedAt: Date | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}

export type TranscriptStatus = 'queued' | 'processing' | 'completed' | 'failed'

@Entity('session_transcripts')
export class SessionTranscript {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'session_recording_id' })
  sessionRecordingId: string

  @ManyToOne('SessionRecording', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_recording_id' })
  sessionRecording: SessionRecording

  /** FK to User (therapist) — only therapist can read this row */
  @Column({ name: 'therapist_id' })
  therapistId: string

  @ManyToOne('User', { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'therapist_id' })
  therapist: User

  @Column({ name: 'assembly_ai_job_id', nullable: true, length: 100, type: 'varchar' })
  assemblyAiJobId: string | null

  @Column({ type: 'varchar', length: 20, default: 'queued' })
  status: TranscriptStatus

  /**
   * Speaker label map JSON: { "A": "Therapist", "B": "Client" }
   * Stored as text; application layer parses.
   */
  @Column({ name: 'speaker_map', type: 'text', nullable: true })
  speakerMap: string | null

  /**
   * Encrypted transcript payload (AES-256-GCM, application-level).
   * Stored as base64 text. Only therapist may decrypt.
   */
  @Column({ name: 'encrypted_transcript', type: 'text', nullable: true })
  encryptedTranscript: string | null

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
