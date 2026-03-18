import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { AgoraModule } from './agora/agora.module';
import { TranscriptionModule } from './transcription/transcription.module';
import { SessionsModule } from './sessions/sessions.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '../../.env', expandVariables: true }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    SessionsModule,
    AgoraModule,
    TranscriptionModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
