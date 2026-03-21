import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import {
  BlogPost,
  ContactInquiry,
  FaqEntry,
  Service,
  TherapistProfile
} from '../database/entities'
import { PublicController } from './public.controller'
import { PublicService } from './public.service'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BlogPost,
      ContactInquiry,
      FaqEntry,
      Service,
      TherapistProfile
    ])
  ],
  controllers: [PublicController],
  providers: [PublicService]
})
export class PublicModule {}