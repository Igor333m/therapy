import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  UseGuards
} from '@nestjs/common';
import type { UserRole } from '@therapy/shared';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import type { AuthUser } from './auth.types';
import { Roles } from './roles.decorator';
import { JwtRolesGuard } from './guards/jwt-roles.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() dto: RegisterDto): Promise<{
    userId: string;
    email: string;
    role: UserRole;
    emailVerified: boolean;
    emailVerificationToken: string;
  }> {
    return this.authService.register(dto);
  }

  @Post('verify-email')
  @HttpCode(200)
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ verified: boolean }> {
    return this.authService.verifyEmail(dto.token);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() dto: LoginDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @HttpCode(200)
  async refresh(@Body() dto: RefreshTokenDto): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  me(@CurrentUser() user: AuthUser): AuthUser {
    return user;
  }

  @Get('moderation/check')
  @UseGuards(JwtRolesGuard)
  @Roles('moderator')
  moderationCheck(@CurrentUser() user: AuthUser): { ok: true; role: string } {
    return { ok: true, role: user.role };
  }
}
