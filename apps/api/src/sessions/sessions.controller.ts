import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../auth/current-user.decorator';
import { JwtRolesGuard } from '../auth/guards/jwt-roles.guard';
import type { AuthUser } from '../auth/auth.types';
import { Roles } from '../auth/roles.decorator';
import { CreateBookingRequestDto } from './dto/create-booking-request.dto';
import { SessionsService } from './sessions.service';

@Controller('sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('booking-requests')
  @UseGuards(JwtRolesGuard)
  @Roles('client')
  createBookingRequest(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateBookingRequestDto
  ): Promise<{ bookingId: string; status: 'pending_therapist_confirmation' }> {
    return this.sessionsService.createBookingRequest({
      clientId: user.userId,
      therapistId: dto.therapistId,
      startAtUtc: dto.startAtUtc
    });
  }

  @Get('therapist-queue')
  @UseGuards(JwtRolesGuard)
  @Roles('therapist')
  therapistQueue(@CurrentUser() user: AuthUser): { therapistId: string; items: number } {
    return {
      therapistId: user.userId,
      items: 0
    };
  }

  @Get('moderation-audit')
  @UseGuards(JwtRolesGuard)
  @Roles('moderator')
  moderationAudit(): { queueDepth: number; openFlags: number } {
    return {
      queueDepth: 0,
      openFlags: 0
    };
  }
}
