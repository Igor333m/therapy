import { resolve } from 'node:path'
import { config as dotenvConfig } from 'dotenv'
import { expand as dotenvExpand } from 'dotenv-expand'
import { DataSource } from 'typeorm'
import {
  AvailabilityException,
  AvailabilityRule,
  BlogPost,
  BookingRequest,
  ContactInquiry,
  FaqEntry,
  Service,
  SessionRecording,
  SessionTranscript,
  TherapistProfile,
  User
} from './entities'

// Migration CLI runs from apps/api, so explicitly load the monorepo root .env.
dotenvExpand(dotenvConfig({ path: resolve(__dirname, '../../../../.env') }))

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error('DATABASE_URL is required to initialize TypeORM DataSource')
}

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  entities: [
    User,
    TherapistProfile,
    Service,
    AvailabilityRule,
    AvailabilityException,
    BookingRequest,
    SessionRecording,
    SessionTranscript,
    BlogPost,
    FaqEntry,
    ContactInquiry
  ],
  migrations: [__dirname + '/migrations/*.{ts,js}'],
  synchronize: false,
  logging: false
})
