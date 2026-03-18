import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
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

const parseBool = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback
  }

  return value.toLowerCase() === 'true'
}

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.getOrThrow<string>('DATABASE_URL'),
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
        synchronize: parseBool(configService.get<string>('DB_SYNCHRONIZE'), false),
        migrationsRun: parseBool(configService.get<string>('DB_MIGRATIONS_RUN'), false),
        logging: configService.get<string>('NODE_ENV') === 'development'
      })
    })
  ],
  exports: [TypeOrmModule]
})
export class DatabaseModule {}
